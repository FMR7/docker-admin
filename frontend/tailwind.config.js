/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',  // Control manual del dark mode
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],  // Asegúrate de que estas rutas estén correctas
  theme: {
    extend: {},  // Puedes extender el tema si lo necesitas
  },
  plugins: [require('daisyui')],  // Si estás usando DaisyUI
}
