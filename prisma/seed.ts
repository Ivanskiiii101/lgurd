import { PrismaClient, CurrencyCode } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  const products = await prisma.product.createManyAndReturn({
    data: [
      {
        slug: "lgurd-n07-extrait-50ml",
        name: "L'GURD N.07 Extrait",
        description:
          "A golden nocturne of smoldering woods, black fig, and burnished amber composed for the after-midnight hour.",
        priceCents: 29500,
        currency: CurrencyCode.usd,
        volumeMl: 50,
        concentration: "Extrait de Parfum",
        heroImageUrl: "/assets/images/lgurd_image.png",
        galleryImageUrls: [],
        notes: {
          top: ["Black Bergamot", "Fig Noir"],
          heart: ["Iris Butter", "Smoked Jasmine"],
          base: ["Amber Resin", "Guaiac Wood", "Labdanum"]
        },
        tags: ["signature", "nocturnal", "unisex"],
        isLimitedEdition: true,
        isFeatured: true,
        stockKeepingUnit: "LG-N07-EX-50"
      },
      {
        slug: "lgurd-n03-parfum-75ml",
        name: "L'GURD N.03 Parfum",
        description:
          "A luminous veil of Sicilian citrus over a heart of white florals and sandalwood, crafted for quiet entrances.",
        priceCents: 26000,
        currency: CurrencyCode.usd,
        volumeMl: 75,
        concentration: "Parfum",
        heroImageUrl: "/assets/images/lgurd-n03.png",
        galleryImageUrls: [],
        notes: {
          top: ["Sicilian Lemon", "Neroli Zest"],
          heart: ["Orange Blossom", "Ylang Accord"],
          base: ["Creamy Sandalwood", "White Musk"]
        },
        tags: ["daylight", "floral", "radiant"],
        isLimitedEdition: false,
        isFeatured: true,
        stockKeepingUnit: "LG-N03-PA-75"
      },
      {
        slug: "lgurd-atelier-amber-100ml",
        name: "L'GURD Atelier — Amber Atlas",
        description:
          "An atlas of resins and rare woods: honeyed amber, smoked vanilla, and ink-dark patchouli tracing the horizon.",
        priceCents: 34000,
        currency: CurrencyCode.usd,
        volumeMl: 100,
        concentration: "Eau de Parfum",
        heroImageUrl: "/assets/images/lgurd-amber-atlas.png",
        galleryImageUrls: [],
        notes: {
          top: ["Saffron Thread", "Blood Orange"],
          heart: ["Amber Accord", "Smoked Vanilla"],
          base: ["Patchouli Noir", "Oud Ink", "Oakwood"]
        },
        tags: ["oriental", "resinous", "atelier"],
        isLimitedEdition: false,
        isFeatured: false,
        stockKeepingUnit: "LG-AT-AMB-100"
      }
    ]
  });

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

