/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color--primary)",
        secondary: "var(--color--secondary)",
        tertiary: "var(--color--tertiary)",
        accent: "var(--color--accent)",
        negative: "var(--color--negative)",
      },
    },
  },
  plugins: [],
};
