import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#dceeff",
          500: "#1677ff",
          600: "#0b67e8",
          700: "#0755c8",
          900: "#071a41",
        },
      },
      boxShadow: {
        card: "0 8px 30px rgba(15, 39, 82, 0.07)",
        soft: "0 4px 18px rgba(15, 39, 82, 0.06)",
      },
      borderRadius: {
        xl2: "18px",
      },
    },
  },
  plugins: [],
} satisfies Config;
