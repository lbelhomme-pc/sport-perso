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
        muted: "#8A9AA0"
      },
      boxShadow: {
        panel: "0 24px 70px rgba(0, 40, 58, 0.12)",
        soft: "0 14px 36px rgba(0, 40, 58, 0.08)"
      },
      fontFamily: {
        display: ["Space Grotesk", "Aptos Display", "Segoe UI", "sans-serif"],
        body: ["Aptos", "Segoe UI", "Helvetica Neue", "sans-serif"]
      },
      borderRadius: {
        panel: "1.75rem"
      }
    }
  },
  plugins: []
};
