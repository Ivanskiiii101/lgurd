import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { sendOrderEmails } from "@/lib/resend";
import { OrderStatus } from "@prisma/client";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Retrieve the full session with line items and customer details
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "line_items.data.price.product", "customer"]
      });

      // Extract cart items from metadata
      const metadata = session.metadata;
      if (!metadata) {
        console.error("Missing metadata in session");
        return NextResponse.json(
          { error: "Missing metadata" },
          { status: 400 }
        );
      }

      // Handle compact format (with short keys) or chunked format
      let cartItemsJson: string;
      if (metadata.cartItems_format === 'chunked') {
        // Reconstruct from chunks
        const chunks: string[] = [];
        let chunkIndex = 0;
        while (metadata[`cartItems_${chunkIndex}`]) {
          chunks.push(metadata[`cartItems_${chunkIndex}`]);
          chunkIndex++;
        }
        cartItemsJson = chunks.join('');
      } else {
        cartItemsJson = metadata.cartItems || '';
      }

      if (!cartItemsJson) {
        console.error("Missing cartItems in session metadata");
        return NextResponse.json(
          { error: "Missing cart items in metadata" },
          { status: 400 }
        );
      }

      // Parse compact format (short keys: p=productId, q=quantity, u=unitPriceCents, c=currency, s=stockKeepingUnit)
      const compactCartItems = JSON.parse(cartItemsJson) as Array<{
        p: string; // productId
        q: number; // quantity
        u: number; // unitPriceCents
        c: string; // currency
        s: string; // stockKeepingUnit
      }>;

      // Convert to full format and get product names from database
      const productIds = compactCartItems.map(item => item.p);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true }
      });
      const productMap = new Map(products.map(p => [p.id, p.name]));
      
      const cartItems = compactCartItems.map((item) => {
        return {
          productId: item.p,
          productName: productMap.get(item.p) || 'Product',
          stockKeepingUnit: item.s,
          quantity: item.q,
          unitPriceCents: item.u,
          currency: item.c
        };
      });

      // Extract customer email from Stripe session (try multiple sources)
      let customerEmail = 
        session.customer_email || 
        session.customer_details?.email ||
        (session.customer && typeof session.customer === 'string' 
          ? undefined // Will fetch from customer object if needed
          : (session.customer as Stripe.Customer | null)?.email) ||
        null;

      // If customer is a string ID, fetch the customer object to get email
      if (!customerEmail && session.customer && typeof session.customer === 'string') {
        try {
          const customer = await stripe.customers.retrieve(session.customer);
          if (customer && !customer.deleted && 'email' in customer) {
            customerEmail = customer.email || null;
          }
        } catch (err) {
          console.warn("Could not fetch customer email from customer object:", err);
        }
      }

      if (!customerEmail) {
        console.error("No customer email found in Stripe session. Session ID:", session.id);
        // Still create the order but log the error
      }

      const customerName =
        session.customer_details?.name ||
        `${session.customer_details?.address?.line1 || ""}`.trim() ||
        "Customer";

      // Try to get shipping address from shipping_details first, then fallback to customer_details address
      const shippingDetails = session.shipping_details;
      const customerAddress = session.customer_details?.address;
      
      let shippingAddress;
      if (shippingDetails?.address) {
        shippingAddress = {
          line1: shippingDetails.address.line1 || "",
          line2: shippingDetails.address.line2 || undefined,
          city: shippingDetails.address.city || "",
          stateOrProvince: shippingDetails.address.state || undefined,
          postalCode: shippingDetails.address.postal_code || "",
          countryCode: shippingDetails.address.country || ""
        };
      } else if (customerAddress) {
        // Fallback to customer address if shipping address is not available
        console.warn("Shipping address not found, using customer address as fallback");
        shippingAddress = {
          line1: customerAddress.line1 || "",
          line2: customerAddress.line2 || undefined,
          city: customerAddress.city || "",
          stateOrProvince: customerAddress.state || undefined,
          postalCode: customerAddress.postal_code || "",
          countryCode: customerAddress.country || ""
        };
      } else {
        // If no address is available, use placeholder (this shouldn't happen in production)
        console.warn("No shipping or customer address found in session, using placeholder");
        shippingAddress = {
          line1: "Address not provided",
          line2: undefined,
          city: "",
          stateOrProvince: undefined,
          postalCode: "",
          countryCode: ""
        };
      }

      // Calculate totals
      const subtotalCents = cartItems.reduce(
        (sum, item) => sum + item.unitPriceCents * item.quantity,
        0
      );
      // For now, set tax and shipping to 0 (can be calculated from session.amount_total)
      const taxCents = 0;
      const shippingCents = 0;
      const totalCents = session.amount_total || subtotalCents;

      // Create order in database
      const order = await prisma.order.create({
        data: {
          stripeCustomerId: session.customer as string | undefined,
          stripeCheckoutSessionId: session.id,
          stripeSessionId: session.id,
          status: OrderStatus.paid,
          subtotalCents,
          taxCents,
          shippingCents,
          totalCents,
          currency: (session.currency?.toLowerCase() as "usd" | "eur" | "gbp") || "usd",
          customerDetails: {
            email: customerEmail || "",
            fullName: customerName,
            phone: session.customer_details?.phone || undefined
          },
          shippingAddress,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              stockKeepingUnit: item.stockKeepingUnit,
              quantity: item.quantity,
              unitPriceCents: item.unitPriceCents,
              currency: (item.currency.toLowerCase() as "usd" | "eur" | "gbp") || "usd"
            }))
          }
        },
        include: {
          items: true
        }
      });

      // Send confirmation emails
      if (customerEmail) {
        try {
          console.log(`Sending confirmation email to: ${customerEmail}`);
          const emailResult = await sendOrderEmails({
            orderId: order.id,
            customerEmail: customerEmail,
            customerName,
            shippingAddress,
            items: cartItems.map((item) => ({
              productName: item.productName,
              quantity: item.quantity,
              unitPriceCents: item.unitPriceCents,
              currency: item.currency
            })),
            subtotalCents,
            taxCents,
            shippingCents,
            totalCents,
            currency: order.currency
          });
          
          if (emailResult.customerEmailSent) {
            console.log(`✅ Customer confirmation email sent successfully to: ${customerEmail}`);
          } else {
            console.error("❌ Failed to send customer email:", emailResult.errors.customer);
          }
          
          if (emailResult.adminEmailSent) {
            console.log("✅ Admin notification email sent successfully");
          } else if (emailResult.errors.admin) {
            console.error("❌ Failed to send admin email:", emailResult.errors.admin);
          }
        } catch (emailError) {
          console.error("Error sending order emails:", emailError);
          // Don't fail the webhook if email fails, but log it
        }
      } else {
        console.warn("⚠️  Skipping email send - no customer email found in session");
      }

      return NextResponse.json({ received: true, orderId: order.id });
    } catch (error) {
      console.error("Error processing checkout.session.completed:", error);
      return NextResponse.json(
        { error: "Failed to process order" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
