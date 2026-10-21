import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "L'GURD — L'essence de l'âme",
  description: "Luxury parfum maison. L'GURD N.07 and more — crafted for the soul.",
  metadataBase: new URL("https://lgurd.example.com"),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen text-white">
        <CartProvider>
          <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-12 md:px-12 lg:px-16">
            <Header />
            <main className="flex-1 mt-16">{children}</main>
            <footer className="mt-24 border-t border-neutral-800/50 pt-8 text-center text-sm text-neutral-500">
              <p>© {new Date().getFullYear()} L&apos;GURD. All rights reserved.</p>
              <p className="mt-2 text-xs text-neutral-600">Crafted for the soul</p>
            </footer>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
