import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Journal — L'GURD",
  description: "The L'GURD Journal — stories, insights, and the world of fragrance."
};

export default function JournalPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in-up">
      <div className="space-y-6">
        <h1 className="font-heading text-5xl md:text-6xl text-white">
          <span className="gold-gradient-text">Journal</span>
        </h1>
        <p className="text-xl text-neutral-300 leading-relaxed">
          Explore the world of L&apos;GURD through our journal—stories of creation, inspiration, and the art of perfumery.
        </p>
      </div>

      <div className="space-y-12 text-neutral-300">
        <article className="gold-card p-8 space-y-4">
          <div className="text-sm uppercase tracking-[0.3em] text-neutral-500">
            Coming Soon
          </div>
          <h2 className="font-heading text-2xl text-white">The Art of Fragrance</h2>
          <p className="leading-relaxed">
            Our journal is being crafted to share the stories behind each creation, the inspirations that drive us, 
            and the artistry that defines L&apos;GURD. Check back soon for exclusive content.
          </p>
        </article>
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

