/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        charcoal: '#1C1C1E',
        'off-white': '#F2F2F2',
        // Brand gray for the final CTA band. `bg-gray` / `text-gray` use this value.
        gray: '#D9DADD',
        gold: '#E8B931',
      },
      fontFamily: {
        // The landing PRD names Manrope (wordmark). It does not name a second
        // text face, so headings, wordmark, and body all use Manrope.
        heading: ['Manrope', 'sans-serif'],
        wordmark: ['Manrope', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        sans: ['Manrope', 'sans-serif'],
      },
    },
  },
}
