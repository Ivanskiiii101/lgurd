"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface SuccessContentProps {
  orderId?: string | null;
  sessionId?: string;
}

export function SuccessContent({ orderId, sessionId }: SuccessContentProps) {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart only when payment is successful (sessionId exists indicates redirect from Stripe)
    // This ensures cart is cleared only after successful payment, not on back navigation
    if (sessionId) {
      // Mark payment as successful in sessionStorage first
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("lgurd-payment-success", "true");
      }
      // Then clear the cart (this also clears localStorage)
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="mt-20 flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="gold-card max-w-lg w-full space-y-8 p-12 text-center animate-fade-in">
        {/* Gold Checkmark Icon with Animation */}
        <div className="mx-auto relative">
          <div className="absolute inset-0 rounded-full bg-lgurd-gold/30 blur-2xl animate-pulse-glow" />
          <div className="relative mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-[#f7e7a9] via-[#d4af37] to-[#8c6c21] flex items-center justify-center shadow-gold-glow animate-scale-in">
            <svg
              className="h-12 w-12 text-black animate-checkmark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="font-heading text-4xl md:text-5xl text-white">
            <span className="gold-gradient-text">Commande Confirmée</span>
          </h1>
          <p className="text-lg text-neutral-300 font-light italic">
            Votre essence est en route
          </p>
        </div>

        {/* Order Details */}
        <div className="space-y-3 pt-4 border-t border-neutral-800/50">
          {orderId && (
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.32em] text-neutral-500">
                Numéro de Commande
              </p>
              <p className="font-mono text-sm text-lgurd-gold font-medium">
                {orderId.slice(0, 8).toUpperCase()}
              </p>
            </div>
          )}
          {sessionId && (
            <p className="text-xs text-neutral-600">
              Session: {sessionId.slice(0, 20)}...
            </p>
          )}
          <p className="text-sm text-neutral-400 leading-relaxed pt-2">
            Un email de confirmation a été envoyé à votre adresse.
            <br />
            Vous recevrez un suivi de livraison sous peu.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-6">
          <Link
            href="/"
            className="gold-button inline-block text-xs uppercase tracking-[0.24em] min-w-[200px]"
          >
            Retourner à la boutique
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="pt-8 flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-lgurd-gold/50 to-transparent" />
          <div className="h-1 w-1 rounded-full bg-lgurd-gold/60" />
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-lgurd-gold/50 to-transparent" />
        </div>
      </div>
    </div>
  );
}
