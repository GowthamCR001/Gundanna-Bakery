/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bakery: {
          primary: '#8B4513',    // Warm SaddleBrown Wood
          secondary: '#D4A373',  // Toast / Caramel
          bg: '#FFF8F0',         // Soft Warm Vanilla Cream
          card: '#FFFFFF',       // Pure Crisp White
          price: '#FF6B35',      // Vibrant Warm Coral / Orange
          text: '#2C2C2C',       // Deep Charcoal
          muted: '#6C757D',      // Muted Soft Gray
          accent: '#FAEDCD',     // Cream Gold Highlight
          gold: '#E9C46A',       // Star Gold Accent
          green: '#2A9D8F',      // Fresh Veg Tag Green
        }
      },
      fontFamily: {
        heading: ['Noto Serif Kannada', 'Playfair Display', 'serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'bakery-card': '0 8px 30px rgba(139, 69, 19, 0.06)',
        'bakery-hover': '0 15px 35px rgba(139, 69, 19, 0.12)',
        'bakery-float': '0 10px 25px rgba(255, 107, 53, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-3%)' },
          '50%': { transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
