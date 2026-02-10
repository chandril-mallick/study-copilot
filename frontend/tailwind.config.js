/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Dabba AI Brand Colors
        neon: {
          blue: "#00D9FF",
          "blue-dark": "#00B8D4",
          "blue-light": "#33E0FF",
        },
        emerald: {
          DEFAULT: "#10B981",
          dark: "#059669",
          light: "#34D399",
        },
        charcoal: {
          DEFAULT: "#1F2937",
          dark: "#111827",
          light: "#374151",
        },
        onyx: "#0A0A0A",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "card": "12px",
        "card-lg": "16px",
      },
      fontFamily: {
        heading: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 217, 255, 0.1)',
        'glass-emerald': '0 8px 32px 0 rgba(16, 185, 129, 0.1)',
        'neon': '0 0 20px rgba(0, 217, 255, 0.3)',
        'neon-emerald': '0 0 20px rgba(16, 185, 129, 0.3)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "pulse-neon": {
          "0%, 100%": { opacity: 1, boxShadow: "0 0 20px rgba(0, 217, 255, 0.3)" },
          "50%": { opacity: 0.8, boxShadow: "0 0 30px rgba(0, 217, 255, 0.5)" },
        },
        "thinking": {
          "0%, 100%": { transform: "scale(1)", opacity: 0.7 },
          "50%": { transform: "scale(1.1)", opacity: 1 },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shimmer": "shimmer 2s infinite linear",
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        "thinking": "thinking 1.5s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
