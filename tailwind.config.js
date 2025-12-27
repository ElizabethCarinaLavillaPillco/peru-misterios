/** @type {import('tailwindcss').Config} */

export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
        "./resources/**/*.tsx",
        "./storage/framework/views/*.php",
    ],
  theme: {
    extend: {
      colors: {
        'pm-gold': '#DBA400',
        'pm-gold-dark': '#B38600',
        'pm-black': '#0A0A0A',
      },
    },
  },
  plugins: [],
}
