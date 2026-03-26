/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8"
        }
      },
      borderRadius: {
        "2xl": "1.5rem",
        "3xl": "2rem"
      },
      boxShadow: {
        glass: "0 18px 60px rgba(15, 23, 42, 0.18)"
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(circle at top left, rgba(59,130,246,0.28), transparent 30%), radial-gradient(circle at top right, rgba(16,185,129,0.18), transparent 28%), linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)",
        "mesh-dark":
          "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 28%), radial-gradient(circle at bottom right, rgba(45,212,191,0.15), transparent 32%), linear-gradient(135deg, #020617 0%, #0f172a 50%, #111827 100%)"
      }
    }
  },
  plugins: []
};
