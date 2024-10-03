/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom colors from your variables
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'pri-clr': 'var(--pri-clr)', // Primary color
        'sec-clr': 'var(--sec-clr)', // Secondary color
        'pri-light-clr': 'var(--pri-light-clr)', // Primary light color
        'logo-clr': 'var(--logo--clr)', // Logo color
      },
      // Custom fonts
      fontFamily: {
        lauanne: ['Lauanne', 'sans-serif'], // Custom Lauanne font
        'pp-neue': ['PP-NEUE', 'sans-serif'], // Custom PP-NEUE font
      },
    },
  },
  plugins: [],
};
