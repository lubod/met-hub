/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./client/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      orange: "#e07856",
      light: "#e8e6e3",
      dark: "#1a1f2e",
      black: "#000000",
      white: "#ffffff",
      transparent: "transparent",
      gray: "#8b9dc3",
      gray2: "#6c757d",
      gray3: "#5E626A",
      blue: "#6ba3a8",
      blue2: "#2559C3",
      purple: "#8b9dc3",
      red: "#c97b6b",
      yellow: "#d4a843",
      green: "#8dbe9d",
      cyan: "#7fb8a8",
      teal: "#8dbe9d",
    },
    extend: {
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [
    require("@headlessui/tailwindcss"),
    require("tailwind-scrollbar-hide"),
  ],
};
