import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        'sm': '576px',
        'md': '768px',
        'lg': '992px',
        'xl': '1240px',
        '2xl': '1456px',
      },
      boxShadow: {
        'custom': '0px 0.5px 2px rgba(0, 0, 0, 0.2)',
        'custom1': 'rgba(0, 0, 0, 0.1) 0px 2px 4px',
        'custom2': 'rgba(0, 0, 0, 0.22) 0px 4px 8px',

      },
      backgroundImage: {
        'bg-homepage': "url('/bg-homepage.jpg')"
      }
    },
  },
  plugins: [],
} satisfies Config;
