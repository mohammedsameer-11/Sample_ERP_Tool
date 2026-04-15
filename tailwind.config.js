/** @type {import('tailwindcss').Config} */
module.exports = {
  // CRITICAL: tells Tailwind which files to scan for class names
  // Without this, all Tailwind classes get purged from production builds
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // Custom animation for skeleton loading screens
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};