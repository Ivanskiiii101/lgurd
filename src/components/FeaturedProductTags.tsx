"use client";

interface FeaturedProductTagsProps {
  tags: string[];
}

export function FeaturedProductTags({ tags }: FeaturedProductTagsProps) {
  const handleTagClick = (tag: string) => {
    // Scroll to collection section first
    const collectionSection = document.getElementById('collection');
    if (collectionSection) {
      collectionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Set URL parameter for filtering
      const url = new URL(window.location.href);
      url.searchParams.set('tag', tag);
      window.history.replaceState({}, '', url.toString());
      
      // Dispatch custom event to trigger filter update
      window.dispatchEvent(new CustomEvent('filterByTag', { detail: { tag } }));
    } else {
      // If we're not on the home page, navigate there
      window.location.href = `/#collection?tag=${tag}`;
    }
  };

  return (
    <div className="flex flex-wrap gap-3 pt-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className="rounded-full border border-neutral-700/50 bg-neutral-900/30 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-neutral-400 backdrop-blur-sm transition-all hover:border-lgurd-gold/50 hover:text-lgurd-gold hover:bg-lgurd-gold/10 cursor-pointer"
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
