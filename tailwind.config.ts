import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        lgurd: {
          black: "#000000",
          gold: "#D4AF37",
          "gold-light": "#F7E7A9",
          "gold-dark": "#8B6914"
        }
      },
      fontFamily: {
        heading: ["\"Playfair Display\"", "serif"],
        body: ["\"Inter\"", "system-ui", "sans-serif"]
      },
      boxShadow: {
        "gold-glow": "0 0 30px rgba(212, 175, 55, 0.35)",
        "gold-glow-lg": "0 0 60px rgba(212, 175, 55, 0.5)",
        "card": "0 20px 60px rgba(0, 0, 0, 0.8)",
        "card-hover": "0 30px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(212, 175, 55, 0.15)"
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem"
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "fade-in": "fade-in 0.8s ease-out",
        "shimmer": "shimmer 3s ease-in-out infinite"
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms"
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)"
      }
    }
  },
  plugins: []
};

export default config;
