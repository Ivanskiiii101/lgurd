import { Resend } from "resend";

// Use a placeholder during build time if RESEND_API_KEY is not set
const resendApiKey = process.env.RESEND_API_KEY || "re_placeholder_for_build";

export const resend = new Resend(resendApiKey);

// Validate at runtime (not during build)
if (process.env.NODE_ENV !== "production" && !process.env.RESEND_API_KEY) {
  console.warn("⚠️  RESEND_API_KEY is not set. Email features will not work.");
}

export interface OrderEmailData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    stateOrProvince?: string;
    postalCode: string;
    countryCode: string;
  };
  items: Array<{
    productName: string;
    quantity: number;
    unitPriceCents: number;
    currency: string;
  }>;
  subtotalCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
  currency: string;
}

export async function sendOrderEmails(orderData: OrderEmailData) {
  const { customerEmail, customerName, shippingAddress, items, totalCents, currency } = orderData;

  // Validate customer email
  if (!customerEmail || !customerEmail.includes('@')) {
    throw new Error(`Invalid customer email: ${customerEmail}`);
  }

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: currency.toUpperCase()
    });
  };

  // Use a verified domain or Resend's default domain for testing
  // IMPORTANT: When using "onboarding@resend.dev", Resend only allows sending to YOUR verified email address
  // To send emails to any customer, you MUST:
  // 1. Verify your domain in Resend: https://resend.com/domains
  // 2. Set RESEND_FROM_EMAIL to an email using your verified domain (e.g., "orders@yourdomain.com")
  // For production, you need to add and verify your domain in Resend
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  console.log(`Attempting to send email from ${fromEmail} to ${customerEmail}`);

  // Customer confirmation email
  const customerEmailResult = await resend.emails.send({
    from: fromEmail,
    to: customerEmail,
    subject: "Order Confirmation — L'GURD",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; background: #000; color: #fff; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #D4AF37; }
            .content { margin: 30px 0; }
            .order-summary { background: #111; border: 1px solid #333; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #222; }
            .item:last-child { border-bottom: none; }
            .total { margin-top: 20px; padding-top: 20px; border-top: 2px solid #D4AF37; font-size: 18px; font-weight: bold; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">L'GURD</div>
              <p style="color: #999; font-size: 12px; margin-top: 5px;">L'essence de l'âme</p>
            </div>
            <div class="content">
              <h1 style="color: #D4AF37; font-size: 28px; margin-bottom: 20px;">Thank you for your order</h1>
              <p>Dear ${customerName},</p>
              <p>Your order has been confirmed and is being prepared for shipment.</p>
              <div class="order-summary">
                <h2 style="color: #D4AF37; font-size: 18px; margin-bottom: 15px;">Order Summary</h2>
                ${items
                  .map(
                    (item) => `
                  <div class="item">
                    <span>${item.productName} × ${item.quantity}</span>
                    <span>${formatPrice(item.unitPriceCents * item.quantity)}</span>
                  </div>
                `
                  )
                  .join("")}
                <div class="total">
                  <div style="display: flex; justify-content: space-between;">
                    <span>Total</span>
                    <span style="color: #D4AF37;">${formatPrice(totalCents)}</span>
                  </div>
                </div>
              </div>
              <p style="margin-top: 30px;">Shipping to:</p>
              <p style="color: #999; line-height: 1.8;">
                ${shippingAddress.line1}<br />
                ${shippingAddress.line2 ? `${shippingAddress.line2}<br />` : ""}
                ${shippingAddress.city}, ${shippingAddress.stateOrProvince || ""} ${shippingAddress.postalCode}<br />
                ${shippingAddress.countryCode}
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} L'GURD. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  });

  // Admin notification email (only send if admin email is configured)
  const adminEmail = process.env.RESEND_ADMIN_EMAIL;
  let adminEmailResult: { data: unknown; error: unknown } = { data: null, error: null };
  
  if (adminEmail) {
    adminEmailResult = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `New Order #${orderData.orderId} — Fulfillment Required`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; background: #f5f5f5; color: #333; line-height: 1.6; }
            .container { max-width: 700px; margin: 0 auto; padding: 40px 20px; background: #fff; }
            .header { border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin: 25px 0; padding: 20px; background: #f9f9f9; border-radius: 8px; }
            .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd; }
            .item:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #666; }
            .value { color: #000; }
            .total { margin-top: 15px; padding-top: 15px; border-top: 2px solid #D4AF37; font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #D4AF37; margin: 0;">New Order Notification</h1>
              <p style="color: #666; margin: 5px 0 0 0;">Order ID: ${orderData.orderId}</p>
            </div>
            <div class="section">
              <h2 style="color: #333; margin-top: 0;">Customer Information</h2>
              <p><span class="label">Name:</span> <span class="value">${customerName}</span></p>
              <p><span class="label">Email:</span> <span class="value">${customerEmail}</span></p>
            </div>
            <div class="section">
              <h2 style="color: #333; margin-top: 0;">Shipping Address</h2>
              <p class="value">
                ${shippingAddress.line1}<br />
                ${shippingAddress.line2 ? `${shippingAddress.line2}<br />` : ""}
                ${shippingAddress.city}, ${shippingAddress.stateOrProvince || ""} ${shippingAddress.postalCode}<br />
                ${shippingAddress.countryCode}
              </p>
            </div>
            <div class="section">
              <h2 style="color: #333; margin-top: 0;">Order Items</h2>
              ${items
                .map(
                  (item) => `
                <div class="item">
                  <span>${item.productName} × ${item.quantity}</span>
                  <span>${formatPrice(item.unitPriceCents * item.quantity)}</span>
                </div>
              `
                )
                .join("")}
              <div class="total">
                <div style="display: flex; justify-content: space-between;">
                  <span>Subtotal:</span>
                  <span>${formatPrice(orderData.subtotalCents)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                  <span>Tax:</span>
                  <span>${formatPrice(orderData.taxCents)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                  <span>Shipping:</span>
                  <span>${formatPrice(orderData.shippingCents)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;">
                  <span>Total:</span>
                  <span style="color: #D4AF37;">${formatPrice(totalCents)}</span>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
    });
  }

  // Log errors if any
  if (customerEmailResult.error) {
    console.error("Error sending customer email:", customerEmailResult.error);
  }
  if (adminEmailResult.error) {
    console.error("Error sending admin email:", adminEmailResult.error);
  }

  return {
    customerEmailSent: customerEmailResult.data !== null,
    adminEmailSent: adminEmailResult.data !== null,
    errors: {
      customer: customerEmailResult.error,
      admin: adminEmailResult.error
    }
  };
}
