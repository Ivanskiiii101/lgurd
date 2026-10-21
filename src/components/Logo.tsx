"use client";

export function Logo({ className = "", showTagline = true }: { className?: string; showTagline?: boolean }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="relative">
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-none">
          <span className="gold-gradient-text relative inline-block">
            L&apos;GURD
          </span>
          <span className="text-base md:text-lg lg:text-xl align-top text-neutral-400 ml-2 font-light">
            N.07
          </span>
        </h1>
      </div>
      {showTagline && (
        <p className="text-xs md:text-sm text-lgurd-gold/70 font-light italic mt-1.5 tracking-[0.15em]">
          L&apos;essence de l&apos;âme
        </p>
      )}
    </div>
  );
}

