"use client";

import { useState, useMemo, useEffect } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { AddToCartToast } from "@/components/AddToCartToast";

interface ProductGalleryProps {
  products: Product[];
}

export function ProductGallery({ products }: ProductGalleryProps) {
  const { addItem } = useCart();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastProductName, setToastProductName] = useState("");
  const [toastButtonRef, setToastButtonRef] = useState<HTMLElement | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Read tag from URL on mount and listen for filter events
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tagParam = urlParams.get('tag');
      if (tagParam) {
        setSelectedTag(tagParam);
      }

      // Listen for filter events from featured product tags
      const handleFilterEvent = (event: CustomEvent) => {
        setSelectedTag(event.detail.tag);
      };
      
      window.addEventListener('filterByTag', handleFilterEvent as EventListener);
      
      return () => {
        window.removeEventListener('filterByTag', handleFilterEvent as EventListener);
      };
    }
  }, []);

  // Get all unique tags from products
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach(product => {
      product.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [products]);

  // Filter products by selected tag
  const filteredProducts = useMemo(() => {
    if (!selectedTag) return products;
    return products.filter(product => product.tags?.includes(selectedTag));
  }, [products, selectedTag]);

  const handleAddToCart = (product: Product, event: React.MouseEvent<HTMLButtonElement>) => {
    addItem(product, 1);
    setToastProductName(product.name);
    setToastButtonRef(event.currentTarget);
    setToastVisible(true);
  };

  return (
    <section className="space-y-12">
      <header className="text-center space-y-6">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.4em] text-neutral-500 font-medium">
            COLLECTION PRIVÉE
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white">
            The L&apos;GURD Parfum Index
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-base">
            Discover our curated selection of luxury fragrances, each crafted with precision and passion.
          </p>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-5 py-2 rounded-full border text-sm uppercase tracking-[0.15em] transition-all duration-300 ${
                selectedTag === null
                  ? "border-lgurd-gold bg-lgurd-gold/10 text-lgurd-gold"
                  : "border-neutral-700/50 bg-neutral-900/30 text-neutral-400 hover:border-lgurd-gold/50 hover:text-lgurd-gold"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-5 py-2 rounded-full border text-sm uppercase tracking-[0.15em] transition-all duration-300 ${
                  selectedTag === tag
                    ? "border-lgurd-gold bg-lgurd-gold/10 text-lgurd-gold"
                    : "border-neutral-700/50 bg-neutral-900/30 text-neutral-400 hover:border-lgurd-gold/50 hover:text-lgurd-gold"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product, index) => (
          <article
            key={product.id}
            className="product-card gold-card group flex flex-col justify-between overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="px-6 py-8 md:px-10 md:py-10 space-y-4 md:space-y-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-medium">
                  {product.concentration}
                </p>
                <h3 className="font-heading text-xl md:text-2xl text-white group-hover:text-lgurd-gold transition-colors duration-300">
                  {product.name}
                </h3>
                {product.isLimitedEdition && (
                  <span className="inline-block px-3 py-1 rounded-full bg-lgurd-gold/10 border border-lgurd-gold/30 text-xs uppercase tracking-[0.2em] text-lgurd-gold">
                    Limited Edition
                  </span>
                )}
              </div>
              
              <p className="text-sm leading-relaxed text-neutral-300 line-clamp-3">
                {product.description}
              </p>
              
              {product.notes && (
                <dl className="space-y-3 pt-4 border-t border-neutral-800/50">
                  {product.notes.top && (
                    <div className="space-y-1">
                      <dt className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-medium">
                        Top Notes
                      </dt>
                      <dd className="text-sm text-neutral-400">{product.notes.top.join(", ")}</dd>
                    </div>
                  )}
                  {product.notes.heart && (
                    <div className="space-y-1">
                      <dt className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-medium">
                        Heart Notes
                      </dt>
                      <dd className="text-sm text-neutral-400">{product.notes.heart.join(", ")}</dd>
                    </div>
                  )}
                  {product.notes.base && (
                    <div className="space-y-1">
                      <dt className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-medium">
                        Base Notes
                      </dt>
                      <dd className="text-sm text-neutral-400">{product.notes.base.join(", ")}</dd>
                    </div>
                  )}
                </dl>
              )}
            </div>
            
            <div className="flex flex-col gap-4 border-t border-neutral-800/50 bg-gradient-to-b from-neutral-900/50 to-transparent px-6 py-6 md:px-10 md:py-8">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-lgurd-gold">
                    {(product.priceCents / 100).toLocaleString("en-US", {
                      style: "currency",
                      currency: product.currency.toUpperCase()
                    })}
                  </span>
                  <span className="text-sm text-neutral-500">
                    / {product.volumeMl}ml
                  </span>
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
                  SKU {product.stockKeepingUnit}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href={`/products/${product.slug}`}
                  className="text-center text-sm uppercase tracking-[0.15em] px-8 py-3 w-full border border-neutral-700/50 bg-transparent text-neutral-300 hover:border-lgurd-gold/50 hover:text-lgurd-gold hover:bg-lgurd-gold/10 transition-all duration-300 rounded-full"
                >
                  Learn More
                </a>
                <button
                  type="button"
                  className="gold-button text-sm uppercase tracking-[0.15em] px-8 py-3 w-full"
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <AddToCartToast
        productName={toastProductName}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
        buttonElement={toastButtonRef}
      />
    </section>
  );
}

