"use client";

import { useEffect, useState, useCallback } from "react";

interface AddToCartToastProps {
  productName: string;
  isVisible: boolean;
  onClose: () => void;
  buttonElement?: HTMLElement | null;
}

export function AddToCartToast({ productName, isVisible, onClose, buttonElement }: AddToCartToastProps) {
  const [position, setPosition] = useState<{ top?: string; bottom?: string; left?: string; right?: string }>({});

  const updatePosition = useCallback(() => {
    if (!buttonElement) {
      return;
    }

    const rect = buttonElement.getBoundingClientRect();
    const toastHeight = 80; // Approximate toast height
    const toastWidth = Math.min(280, window.innerWidth - 32);
    const spacing = 16;

    // Always position below the button with proper spacing
    // getBoundingClientRect gives viewport-relative coordinates (perfect for fixed positioning)
    const top = rect.bottom + spacing;
    
    // Calculate horizontal positioning - center relative to button width
    const buttonCenterX = rect.left + (rect.width / 2);
    let left = buttonCenterX - (toastWidth / 2);
    
    // Ensure toast doesn't go off the right edge
    if (left + toastWidth > window.innerWidth - spacing) {
      left = window.innerWidth - toastWidth - spacing;
    }
    
    // Ensure toast doesn't go off the left edge
    if (left < spacing) {
      left = spacing;
    }
    
    // Ensure toast doesn't go off bottom of viewport
    const bottomEdge = window.innerHeight;
    let finalTop = top;
    if (top + toastHeight > bottomEdge - spacing) {
      // If it would go off bottom, position above button instead
      finalTop = rect.top - toastHeight - spacing;
    }
    
    setPosition({ 
      top: `${finalTop}px`,
      left: `${left}px`,
      right: undefined,
      bottom: undefined
    });
  }, [buttonElement]);

  useEffect(() => {
    if (isVisible && buttonElement) {
      updatePosition();
      
      // Update position on scroll or resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    } else if (isVisible) {
      // Fallback to bottom-right if no button reference
      setPosition({ top: undefined, bottom: '2rem', right: '2rem', left: undefined });
    }
  }, [isVisible, buttonElement, updatePosition]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed z-50 animate-fade-in-up pointer-events-none"
      style={{ 
        top: position.top,
        bottom: position.bottom,
        right: position.right,
        left: position.left,
        maxWidth: 'calc(100vw - 2rem)',
      }}
    >
      <div className="gold-card px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-3 sm:gap-4 shadow-gold-glow-lg min-w-[240px] sm:min-w-[280px]">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-lgurd-gold/20 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-lgurd-gold"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Added to Cart</p>
          <p className="text-xs text-neutral-400 truncate">{productName}</p>
        </div>
      </div>
    </div>
  );
}

