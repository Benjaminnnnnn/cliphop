// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: "#ff5f6d",
        brandSecondary: "#ffc371",
        ink: "#0f172a",
        mist: "#f5f7fb",
        primary: "rgb(22, 24, 35)",
      },
      width: {
        1600: "1600px",
        400: "400px",
        450: "450px",
        210: "210px",
        550: "550px",
        260: "260px",
        650: "650px",
      },
      height: {
        600: "600px",
        280: "280px",
        900: "900px",
        458: "458px",
      },
      top: {
        " 50%": "50%",
      },
      backgroundColor: {
        primary: "#F1F1F2",
        blur: "#030303",
      },
      height: {
        "88vh": "88vh",
      },
      backgroundImage: {
        "blurred-img":
          "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsaaJ7s4lqcBF4IDROVPzrlL5fexcwRmDlnuEYQenWTt1DejFY5kmYDref2a0Hp2eE4aw&usqp=CAU')",
        "aurora-gradient":
          "radial-gradient(circle at 10% 20%, rgba(255,95,109,0.18), transparent 25%), radial-gradient(circle at 90% 10%, rgba(14,165,233,0.15), transparent 22%), linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
      },
    },
  },
  plugins: [],
};
