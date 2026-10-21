"use client";

import { useCart } from "@/context/CartContext";
import { createCheckoutSession } from "@/app/actions/checkout";
import { useState, useEffect } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, count } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const subtotalCents = items.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0
  );

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Trigger animation after a brief delay to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    } else {
      // Start closing animation
      setIsVisible(false);
      // Remove from DOM after animation completes
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = '';
      }, 300); // Match transition duration
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsProcessing(true);
    try {
      const result = await createCheckoutSession(items);
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        alert(result.error || "Failed to start checkout");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match transition duration
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-md transition-opacity duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      {/* Drawer */}
      <div className={`fixed right-0 top-0 z-50 h-full w-full sm:max-w-md lg:max-w-lg overflow-y-auto bg-gradient-to-b from-neutral-950 via-black to-black border-l border-neutral-800/50 shadow-2xl transition-transform duration-300 ease-out ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800/50 bg-neutral-950/50 backdrop-blur-sm px-4 py-4 md:px-8 md:py-6 sticky top-0">
            <h2 className="font-heading text-2xl text-white">
              <span className="gold-gradient-text">Cart</span>
              {count > 0 && (
                <span className="ml-3 text-sm text-neutral-500 font-normal">
                  ({count} {count === 1 ? 'item' : 'items'})
                </span>
              )}
            </h2>
            <button
              onClick={handleClose}
              className="text-neutral-400 hover:text-white transition-all duration-300 hover:rotate-90 p-2 rounded-full hover:bg-neutral-800/50"
              aria-label="Close cart"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-6">
            {items.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div className="space-y-4">
                  <div className="text-6xl mb-4">🛍️</div>
                  <p className="text-neutral-400 text-lg">Your cart is empty</p>
                  <button
                    onClick={handleClose}
                    className="gold-button text-sm uppercase tracking-[0.2em] mt-6"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="gold-card flex gap-5 p-5 group"
                  >
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-heading text-lg text-white group-hover:text-lgurd-gold transition-colors">
                          {item.product.name}
                        </h3>
                        <p className="mt-1 text-sm text-neutral-400">
                          {item.product.concentration} • {item.product.volumeMl}ml
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-lgurd-gold">
                        {(item.product.priceCents / 100).toLocaleString("en-US", {
                          style: "currency",
                          currency: item.product.currency.toUpperCase()
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900/50 text-base text-neutral-400 hover:border-lgurd-gold hover:text-lgurd-gold hover:bg-lgurd-gold/10 transition-all duration-300"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-base font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900/50 text-base text-neutral-400 hover:border-lgurd-gold hover:text-lgurd-gold hover:bg-lgurd-gold/10 transition-all duration-300"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-xs text-neutral-500 hover:text-red-400 transition-colors duration-300 uppercase tracking-[0.1em]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with totals and checkout */}
          {items.length > 0 && (
            <div className="border-t border-neutral-800/50 bg-neutral-950/50 backdrop-blur-sm p-4 md:p-8 space-y-4 md:space-y-6 sticky bottom-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-base">
                  <span className="text-neutral-400 font-medium">Subtotal</span>
                  <span className="text-xl font-bold text-white">
                    {(subtotalCents / 100).toLocaleString("en-US", {
                      style: "currency",
                      currency: items[0]?.product.currency.toUpperCase() || "USD"
                    })}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 text-center">
                  Tax & shipping calculated at checkout
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || items.length === 0}
                  className="gold-button w-full text-sm uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                  {isProcessing ? "Processing..." : "Go to Checkout"}
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs text-neutral-500 hover:text-red-400 transition-colors duration-300 uppercase tracking-[0.1em] py-2"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
