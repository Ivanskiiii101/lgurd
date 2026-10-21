import Stripe from "stripe";

// Use a placeholder during build time if STRIPE_SECRET_KEY is not set
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_for_build";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia",
  typescript: true
});

// Validate at runtime (not during build)
if (process.env.NODE_ENV !== "production" && !process.env.STRIPE_SECRET_KEY) {
  console.warn("⚠️  STRIPE_SECRET_KEY is not set. Stripe features will not work.");
}
