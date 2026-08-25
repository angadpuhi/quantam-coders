import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        kerala: {
          green: {
            50: "#f2f8f5",
            100: "#e1efe8",
            200: "#c3dfd1",
            300: "#97c5b0",
            400: "#67a58a",
            500: "#44876c",
            600: "#326c55",
            700: "#275544",
            800: "#1b4332", // Deep Kerala Palm Green
            900: "#133125",
            950: "#091c14",
          },
          blue: {
            50: "#f0f8fb",
            100: "#dcf0f7",
            200: "#bde1ef",
            300: "#8ecc44",
            400: "#59b0d2",
            500: "#3594bc",
            600: "#25789f",
            700: "#1e6081",
            800: "#1c516c", // Backwater Lagoon Blue
            900: "#10384c",
            950: "#092230",
          },
          coir: {
            50: "#fdfbf7",
            100: "#f8f3ea",
            200: "#ede3d1",
            300: "#decdb0",
            400: "#cbaf89",
            500: "#ba956a",
            600: "#a98055",
            700: "#8c6544",
            800: "#73523b", // Coconut Husk Brown
            900: "#5e4231",
            950: "#332219",
          },
          gold: {
            50: "#fffbeb",
            100: "#fef3c7",
            200: "#fde68a",
            300: "#fcd34d",
            400: "#fbbf24",
            500: "#f59e0b",
            600: "#d97706",
            700: "#b45309", // Nilavilakku Brass Gold
            800: "#92400e",
            900: "#78350f",
          },
        },
      },
      borderRadius: {
        houseboat: "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
