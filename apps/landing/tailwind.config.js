/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        charcoal: '#1C1C1E',
        'off-white': '#F2F2F2',
        // Brand gray for the final CTA band. Named apart from Tailwind's gray scale.
        'brand-gray': '#D9DADD',
        gold: '#E8B931',
      },
      fontFamily: {
        // Figma sets text and headings in Inter. The wordmark is the SVG lockup,
        // not live type, so the wordmark token uses the same face.
        heading: ['Inter', 'sans-serif'],
        wordmark: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
}
