/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./client/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      orange: "#fd7e14",
      light: "#f8f9fa",
      dark: "#212529",
      black: "#000000",
      gray: "#989D9B",
      gray2: "#6c757d",
      gray3: "#5E626A",
      blue: "#0d6efd",
      blue2: "#2559C3",
      purple: "#6f42c1",
      red: "#dc3545",
      yellow: "#ffc107",
      green: "#198754",
    },
    extend: {},
  },
  plugins: [
    require("@headlessui/tailwindcss"),
    require("tailwind-scrollbar-hide"),
  ],
};
