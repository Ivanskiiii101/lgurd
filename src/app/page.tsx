import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import type { Product } from "@/lib/types";
import { ProductGallery } from "@/components/ProductGallery";
import { FeaturedProductTags } from "@/components/FeaturedProductTags";

export const metadata: Metadata = {
  title: "L'GURD — Collection N.07",
  description: "Discover the L'GURD N.07 collection — a study in golden nocturnes."
};

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';

const heroCopy =
  "A constellation of amber, smoldering woods, and midnight citrus — composed for those who move in whispers, not echoes.";

async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    orderBy: { createdAt: "asc" }
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    priceCents: row.priceCents,
    currency: row.currency,
    volumeMl: row.volumeMl,
    concentration: row.concentration,
    heroImageUrl: row.heroImageUrl,
    galleryImageUrls: row.galleryImageUrls,
    notes: (row.notes as Product["notes"]) ?? undefined,
    tags: row.tags,
    isLimitedEdition: row.isLimitedEdition,
    isFeatured: row.isFeatured,
    stockKeepingUnit: row.stockKeepingUnit,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  }));
}

export default async function HomePage() {
  const products = await getProducts();
  const featuredProduct = products.find(p => p.isFeatured) || products[0];

  return (
    <div className="space-y-16 md:space-y-24 animate-fade-in-up">
      {/* Hero Section */}
      <section className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-neutral-500 font-medium">
              L&apos;ESSENCE DE L&apos;ÂME
            </p>
            <h1 className="font-heading text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="gold-gradient-text block">
                The golden nocturne of{" "}
                <span className="whitespace-nowrap">L&apos;GURD N.07</span>
              </span>
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-neutral-300 md:text-xl">
            {heroCopy}
          </p>
          <a 
            href="#collection"
            className="gold-button text-sm uppercase tracking-[0.2em] inline-block mt-6"
          >
            View Collection
          </a>
        </div>

        {/* Featured Product Hero Card */}
        <div className="gold-card overflow-hidden h-[500px] md:h-[600px] animate-scale-in">
          <div className="relative h-full w-full flex flex-col">
            {/* Animated background gradients */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.25),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(212,175,55,0.15),transparent_50%)]" />
            
            {/* Content - Top Section */}
            <div className="flex-shrink-0 p-6 md:p-10 lg:p-12 space-y-3 md:space-y-4 relative z-10">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-medium">
                L&apos;GURD PARFUM — N.07
              </p>
              {featuredProduct && (
                <>
                  <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-white">
                    {featuredProduct.name}
                  </h2>
                  <p className="max-w-md text-sm leading-relaxed text-neutral-300 md:text-base">
                    {featuredProduct.description}
                  </p>
                  {featuredProduct.tags && featuredProduct.tags.length > 0 && (
                    <FeaturedProductTags tags={featuredProduct.tags} />
                  )}
                </>
              )}
            </div>

            {/* Centered decorative element - Bottom section */}
            <div className="flex-1 flex items-center justify-center relative z-10">
              <div className="text-center">
                <div className="text-7xl md:text-8xl lg:text-9xl font-heading text-lgurd-gold/10 select-none">
                  L&apos;GURD
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Collection */}
      <section id="collection" className="animate-fade-in-up">
        <ProductGallery products={products} />
      </section>
    </div>
  );
}
