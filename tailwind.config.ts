import type { Config } from "tailwindcss";

/**
 * Semantic scales replacing the ~117 ad-hoc hex literals the UI used to inline.
 * Anchors are the values that were already dominant in the design:
 * brand-600 (#1268ee) was the primary, brand-700 (#0758d4) its hover,
 * brand-500 (#1677ff) the focus ring. The rest interpolate around them so the
 * palette behaves like a scale instead of a pile of one-off values.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f7ff",
          100: "#e0edff",
          200: "#c2dcff",
          300: "#93c1ff",
          400: "#5799ef",
          500: "#1677ff",
          600: "#1268ee",
          700: "#0758d4",
          800: "#1555ad",
          900: "#0b3a7a",
          /** Steel navy used for avatars and badges in the header design. */
          navy: "#315b8c",
        },
        /** Navy text scale: 300 placeholder → 900 heading. */
        ink: {
          300: "#9bb1cb",
          400: "#8397b1",
          500: "#66809f",
          600: "#4f6b91",
          700: "#28476d",
          800: "#17345e",
          900: "#0b1f46",
        },
        /** Border scale, light → heavy. */
        line: {
          100: "#edf2f8",
          200: "#e1eaf5",
          300: "#d4e0ee",
          400: "#cbd9eb",
          500: "#b9cbe5",
        },
        surface: {
          base: "#f8fbff",
          raised: "#ffffff",
          sunken: "#f2f7fd",
          accent: "#edf7ff",
          inverse: "#061b38",
        },
        success: {
          50: "#e8fbf0",
          500: "#15935a",
          700: "#0f7145",
        },
        danger: {
          50: "#fff1f1",
          500: "#d92d20",
          600: "#c42318",
        },
        warning: {
          500: "#ffb400",
        },
      },
      boxShadow: {
        card: "0 8px 30px rgba(15, 39, 82, 0.07)",
        soft: "0 4px 18px rgba(15, 39, 82, 0.06)",
        overlay: "0 16px 50px rgba(24, 58, 100, 0.09)",
      },
      borderRadius: {
        xl2: "18px",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
