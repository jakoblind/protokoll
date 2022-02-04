const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-blue": {
          500: "#023E7D",
          600: "#023871",
          700: "#01254B",
          800: "#011C38",
          900: "#011326",
        },
        blue: {
          100: "#E6ECF2",
          200: "#C0CFDF",
          300: "#9AB2CB",
          400: "#4E78A4",
          500: "#0466C8",
          600: "#0353A4",
          700: "#023E7D",
          800: "#002855",
          900: "#001845",
          1000: "#001233",
        },
        gray: {
          400: "#33415C",
          300: "#5C677D",
          200: "#7D8597",
          100: "#979DAC",
        },
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/forms")],
};
