"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { AddToCartToast } from "@/components/AddToCartToast";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastProductName, setToastProductName] = useState("");
  const [toastButtonRef, setToastButtonRef] = useState<HTMLElement | null>(null);

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    addItem(product, 1);
    setToastProductName(product.name);
    setToastButtonRef(event.currentTarget);
    setToastVisible(true);
  };

  return (
    <div className="space-y-12 md:space-y-16 animate-fade-in-up">
      {/* Back Button */}
      <div>
        <Link
          href="/#collection"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-lgurd-gold transition-colors duration-300 text-sm uppercase tracking-[0.2em]"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Collection
        </Link>
      </div>

      {/* Product Detail Section */}
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
        {/* Product Image */}
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-3xl gold-card">
          <img
            src={product.heroImageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Information */}
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-medium">
              {product.concentration}
            </p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white">
              {product.name}
            </h1>
            {product.isLimitedEdition && (
              <span className="inline-block px-4 py-2 rounded-full bg-lgurd-gold/10 border border-lgurd-gold/30 text-sm uppercase tracking-[0.2em] text-lgurd-gold">
                Limited Edition
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-lg leading-relaxed text-neutral-300">
              {product.description}
            </p>
          </div>

          {/* Notes */}
          {product.notes && (
            <div className="space-y-6 pt-6 border-t border-neutral-800/50">
              <h2 className="text-lg uppercase tracking-[0.2em] text-neutral-400 font-medium">
                Fragrance Notes
              </h2>
              <dl className="space-y-4">
                {product.notes.top && (
                  <div className="space-y-2">
                    <dt className="text-sm uppercase tracking-[0.2em] text-neutral-500 font-medium">
                      Top Notes
                    </dt>
                    <dd className="text-base text-neutral-300">
                      {product.notes.top.join(", ")}
                    </dd>
                  </div>
                )}
                {product.notes.heart && (
                  <div className="space-y-2">
                    <dt className="text-sm uppercase tracking-[0.2em] text-neutral-500 font-medium">
                      Heart Notes
                    </dt>
                    <dd className="text-base text-neutral-300">
                      {product.notes.heart.join(", ")}
                    </dd>
                  </div>
                )}
                {product.notes.base && (
                  <div className="space-y-2">
                    <dt className="text-sm uppercase tracking-[0.2em] text-neutral-500 font-medium">
                      Base Notes
                    </dt>
                    <dd className="text-base text-neutral-300">
                      {product.notes.base.join(", ")}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-4">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full border border-neutral-700/50 bg-neutral-900/30 text-xs uppercase tracking-[0.2em] text-neutral-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price and Add to Cart */}
          <div className="pt-8 border-t border-neutral-800/50 space-y-6">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-semibold text-lgurd-gold">
                  {(product.priceCents / 100).toLocaleString("en-US", {
                    style: "currency",
                    currency: product.currency.toUpperCase()
                  })}
                </span>
                <span className="text-base text-neutral-500">
                  / {product.volumeMl}ml
                </span>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
                SKU {product.stockKeepingUnit}
              </p>
            </div>

            <button
              type="button"
              className="gold-button text-base uppercase tracking-[0.15em] px-12 py-4 w-full"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <AddToCartToast
        productName={toastProductName}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
        buttonElement={toastButtonRef}
      />
    </div>
  );
}

