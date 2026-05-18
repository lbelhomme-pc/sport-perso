/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        petrol: {
          900: "#00283A",
          800: "#00354A",
          700: "#0A4B61"
        },
        cream: "#F4F4EE",
        mist: "#E3E9E9",
        limeSoft: "#DCEFA3",
        sage: "#D9DDD0",
        ink: "#0C3447",
        muted: "#6F8188"
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
