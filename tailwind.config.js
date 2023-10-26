/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'gif': 'url(https://qph.cf2.quoracdn.net/main-qimg-561d8e3369e8275e820f6e315d9251ae)'
      },
      fontFamily: {
        "inria-sans": "Inria Sans",
        "inria-serif": "Inria Serif",
        jost: "Jost"
      }
    },
  },
  plugins: [],
}

