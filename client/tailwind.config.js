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
        dark: "rgb(115,149,82)",
        blackDarkest: "rgb(33,31,28)",
        blackDark: "rgb(38,37,32)",
        blackLight: "rgb(48,46,43)",
        buttonLight: "rgb(128,182,77)",
        buttonDark: "rgb(69,116,61)"
      },
      screens: {
        'lg-976': '976px',
        'lg-930':"930px"
      }

    },
  },
  plugins: [],
}

