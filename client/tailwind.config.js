/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: "rgb(234,237,208)",
        dark: "rgb(115,149,82)"
      },

    },
  },
  plugins: [],
}

