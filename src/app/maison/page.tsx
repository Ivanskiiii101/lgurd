import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Maison — L'GURD",
  description: "Discover the L'GURD maison — our story, craftsmanship, and legacy."
};

export default function MaisonPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in-up">
      <div className="space-y-6">
        <h1 className="font-heading text-5xl md:text-6xl text-white">
          <span className="gold-gradient-text">Maison</span> L&apos;GURD
        </h1>
        <p className="text-xl text-neutral-300 leading-relaxed">
          Born from a vision to capture the essence of the soul, L&apos;GURD represents the pinnacle of perfumery artistry.
        </p>
      </div>

      <div className="space-y-8 text-neutral-300">
        <section className="space-y-4">
          <h2 className="font-heading text-3xl text-white">Our Story</h2>
          <p className="leading-relaxed">
            L&apos;GURD was founded on the principle that fragrance is more than a scent—it&apos;s an expression of identity, 
            an invisible signature that speaks to the soul. Each creation in our collection is meticulously crafted to embody 
            this philosophy, using only the finest ingredients from around the world.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-3xl text-white">Craftsmanship</h2>
          <p className="leading-relaxed">
            Our master perfumers work with precision and passion, blending rare essences to create fragrances that transcend 
            time. Every bottle represents hours of refinement, ensuring that each note harmonizes perfectly with the next.
          </p>
        </section>
      </div>

      <div className="pt-8">
        <Link
          href="/"
          className="gold-button text-sm uppercase tracking-[0.2em]"
        >
          Return to Collection
        </Link>
      </div>
    </div>
  );
}

