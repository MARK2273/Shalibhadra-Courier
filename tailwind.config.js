/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a73e8", // Example primary color, adjust as needed
        secondary: "#5f6368",
        success: "#34a853",
        danger: "#ea4335",
        warning: "#fbbc04",
        info: "#4285f4",
      },
    },
  },
  plugins: [],
}
