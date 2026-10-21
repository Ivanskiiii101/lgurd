"use server";

import { stripe } from "@/lib/stripe";
import type { CartItem } from "@/context/CartContext";

interface CheckoutResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function createCheckoutSession(
  cartItems: CartItem[]
): Promise<CheckoutResult> {
  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: "Cart is empty" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    // Prepare line items for Stripe
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: item.product.currency,
        product_data: {
          name: item.product.name,
          description: `${item.product.concentration} • ${item.product.volumeMl}ml`,
          images: item.product.heroImageUrl
            ? [`${baseUrl}${item.product.heroImageUrl}`]
            : []
        },
        unit_amount: item.product.priceCents
      },
      quantity: item.quantity
    }));

    // Store cart items in metadata for webhook retrieval
    // Use compact format to stay under Stripe's 500 character limit per metadata value
    // Store only essential data with short keys: productId, quantity, unitPriceCents, currency, SKU
    const compactCartItems = cartItems.map((item) => ({
      p: item.product.id, // productId
      q: item.quantity, // quantity
      u: item.product.priceCents, // unitPriceCents
      c: item.product.currency, // currency
      s: item.product.stockKeepingUnit // stockKeepingUnit
    }));
    
    const cartItemsJson = JSON.stringify(compactCartItems);
    
    // Build metadata object
    let metadata: Record<string, string>;
    
    // If still too long, split into multiple metadata keys (each can be up to 500 chars)
    if (cartItemsJson.length > 500) {
      // Split into chunks
      metadata = {};
      const chunkSize = 450; // Leave some margin
      let chunkIndex = 0;
      for (let i = 0; i < cartItemsJson.length; i += chunkSize) {
        metadata[`cartItems_${chunkIndex}`] = cartItemsJson.slice(i, i + chunkSize);
        chunkIndex++;
      }
      metadata.cartItems_count = cartItems.length.toString();
      metadata.cartItems_format = 'chunked';
    } else {
      metadata = {
        cartItems: cartItemsJson,
        cartItems_format: 'compact'
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
      metadata,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "FR", "DE", "IT", "ES"]
      },
      customer_email: undefined // Will be collected in checkout form
    });

    return {
      success: true,
      url: session.url || undefined
    };
  } catch (error) {
    console.error("Stripe checkout session creation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create checkout session"
    };
  }
}
