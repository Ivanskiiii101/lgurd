import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import type { Product } from "@/lib/types";

export const dynamic = 'force-dynamic';

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const row = await prisma.product.findUnique({
      where: { slug }
    });

    if (!row) return null;

    return {
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
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found — L'GURD"
    };
  }

  return {
    title: `${product.name} — L'GURD`,
    description: product.description
  };
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}

