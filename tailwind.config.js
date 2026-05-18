/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        petrol: {
          900: "rgb(var(--color-petrol-900) / <alpha-value>)",
          800: "rgb(var(--color-petrol-800) / <alpha-value>)",
          700: "rgb(var(--color-petrol-700) / <alpha-value>)"
        },
        cream: "rgb(var(--color-cream) / <alpha-value>)",
        mist: "rgb(var(--color-mist) / <alpha-value>)",
        limeSoft: "rgb(var(--color-lime-soft) / <alpha-value>)",
        sage: "rgb(var(--color-sage) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)"
      },
      boxShadow: {
        panel: "0 28px 90px rgba(0, 40, 58, 0.14)",
        soft: "0 18px 46px rgba(0, 40, 58, 0.09)",
        lift: "0 18px 50px rgba(0, 40, 58, 0.16)"
      },
      fontFamily: {
        display: ["Space Grotesk", "Aptos Display", "Segoe UI", "sans-serif"],
        body: ["Aptos", "Segoe UI", "Helvetica Neue", "sans-serif"]
      },
      borderRadius: {
        panel: "2rem",
        card: "1.35rem"
      }
    }
  },
  plugins: []
};
