"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { Logo } from "@/components/Logo";

export function Header() {
  const { count } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="flex items-center justify-between border-b border-neutral-800/50 pb-6">
        <Link href="/" className="flex items-center gap-2 md:gap-4 hover:opacity-80 transition-opacity">
          <div className="h-10 w-10 md:h-14 md:w-14 rounded-full bg-gradient-to-br from-lgurd-gold-light via-lgurd-gold to-lgurd-gold-dark shadow-gold-glow flex items-center justify-center flex-shrink-0">
            <span className="text-xl md:text-2xl font-heading text-black font-bold">L</span>
          </div>
          <Logo className="hidden sm:flex" />
          <Logo className="sm:hidden" showTagline={false} />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-sm uppercase tracking-[0.2em] text-neutral-400 lg:flex">
          <Link 
            href="/"
            className="relative hover:text-lgurd-gold transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-lgurd-gold after:transition-all after:duration-300 hover:after:w-full"
          >
            Home
          </Link>
          <Link 
            href="/#collection"
            className="relative hover:text-lgurd-gold transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-lgurd-gold after:transition-all after:duration-300 hover:after:w-full"
          >
            Collections
          </Link>
          <Link 
            href="/maison"
            className="relative hover:text-lgurd-gold transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-lgurd-gold after:transition-all after:duration-300 hover:after:w-full"
          >
            Maison
          </Link>
          <Link 
            href="/journal"
            className="relative hover:text-lgurd-gold transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-lgurd-gold after:transition-all after:duration-300 hover:after:w-full"
          >
            Journal
          </Link>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center hover:text-lgurd-gold transition-all duration-300 p-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-lgurd-gold text-xs font-bold text-black px-1.5">
                {count}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile menu buttons */}
        <div className="lg:hidden flex items-center gap-3">
          {/* Cart button with icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center w-10 h-10 rounded-full border border-neutral-800/50 bg-neutral-900/30 hover:border-lgurd-gold/50 hover:text-lgurd-gold hover:bg-neutral-900/50 transition-all duration-300 text-neutral-300"
            aria-label="Open cart"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-lgurd-gold text-xs font-bold text-black px-1.5">
                {count}
              </span>
            )}
          </button>

          {/* Hamburger menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative flex flex-col items-center justify-center w-10 h-10 rounded-full border border-neutral-800/50 bg-neutral-900/30 hover:border-lgurd-gold/50 hover:bg-neutral-900/50 transition-all duration-300 group"
            aria-label="Toggle menu"
          >
            <span
              className={`absolute w-5 h-0.5 bg-neutral-300 group-hover:bg-lgurd-gold transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
              }`}
            />
            <span
              className={`absolute w-5 h-0.5 bg-neutral-300 group-hover:bg-lgurd-gold transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute w-5 h-0.5 bg-neutral-300 group-hover:bg-lgurd-gold transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <nav
            className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-gradient-to-b from-neutral-950 via-black to-black border-l border-neutral-800/50 shadow-2xl lg:hidden transform transition-transform duration-300 ease-out ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Mobile menu header */}
              <div className="flex items-center justify-between border-b border-neutral-800/50 bg-neutral-950/50 backdrop-blur-sm px-6 py-5">
                <Logo showTagline={false} />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-neutral-400 hover:text-white transition-colors p-2"
                  aria-label="Close menu"
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

              {/* Mobile menu links */}
              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
                <Link
                  href="/"
                  onClick={handleLinkClick}
                  className="block text-lg uppercase tracking-[0.2em] text-neutral-400 hover:text-lgurd-gold transition-colors duration-300 py-2 border-b border-neutral-800/30"
                >
                  Home
                </Link>
                <Link
                  href="/#collection"
                  onClick={handleLinkClick}
                  className="block text-lg uppercase tracking-[0.2em] text-neutral-400 hover:text-lgurd-gold transition-colors duration-300 py-2 border-b border-neutral-800/30"
                >
                  Collections
                </Link>
                <Link
                  href="/maison"
                  onClick={handleLinkClick}
                  className="block text-lg uppercase tracking-[0.2em] text-neutral-400 hover:text-lgurd-gold transition-colors duration-300 py-2 border-b border-neutral-800/30"
                >
                  Maison
                </Link>
                <Link
                  href="/journal"
                  onClick={handleLinkClick}
                  className="block text-lg uppercase tracking-[0.2em] text-neutral-400 hover:text-lgurd-gold transition-colors duration-300 py-2 border-b border-neutral-800/30"
                >
                  Journal
                </Link>
              </div>
            </div>
          </nav>
        </>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

