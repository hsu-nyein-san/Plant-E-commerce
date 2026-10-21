/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    fontFamily: {
      sans: ["Montserrat", "Padauk", "sans-serif"],
    },
    extend: {
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
      },
      
      // 2. Expanded Color System
      colors: {
        // --- Brand Primary (Green) ---
        brand: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#2B7A4B", //  Base / Primary Green
          600: "#23613C", // Hover state (darker shade)
          700: "#1B4A2D",
          800: "#13331F",
          900: "#0A1C11",
          DEFAULT: "#2B7A4B", // Primary Green
          hover: "#23613C",   // Hover Green
        },
        surface: {
          DEFAULT: "#F7F4EF", // Main page background (warm off-white)
          card: "#FFFDF9",    // Card and navbar background
          muted: "#F3F4F6",   // Placeholder image background (gray-100)
          hover: "#F9FAFB",   // Hover states on white cards
        },

        // --- Typography Colors ---
        ink: {
          DEFAULT: "#1E1E20", // Primary headings (near black)
          secondary: "#4B4B4B", // Subtext and descriptions (gray-600)
          muted: "#5A5A5A",   // Small labels and hints (gray-400)
        },

        // --- Borders & Dividers ---
        border: {
          DEFAULT: "#E5E7EB", // Standard borders (gray-200)
          light: "#F3F4F6",   // Very subtle borders
          focus: "#2B7A4B",   // Focus ring matches brand
        },

        // --- Semantic / Status ---
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },

      // 3. Custom Border Radius for large cards
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem', // Used for Hero and Product cards
        '4xl': '2rem',
      },

      // 4. Custom Box Shadows
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [require("flowbite/plugin")],
};