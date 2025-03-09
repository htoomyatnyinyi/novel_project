// import { useEffect, useState } from "react";

// const useTheme = () => {
//   // Get initial theme from localStorage or system preference
//   const getInitialTheme = () => {
//     if (localStorage.getItem("theme")) return localStorage.getItem("theme");
//     return window.matchMedia("(prefers-color-scheme: dark)").matches
//       ? "dark"
//       : "light";
//   };

//   const [theme, setTheme] = useState(getInitialTheme);

//   useEffect(() => {
//     // Apply the theme to the document
//     document.documentElement.classList.toggle("dark", theme === "dark");

//     if (theme) {
//       localStorage.setItem("theme", theme);
//     } else {
//       localStorage.removeItem("theme"); // Remove to respect OS preference
//     }
//   }, [theme]);

//   // Function to toggle theme
//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
//   };

//   return { theme, toggleTheme };
// };

// export default useTheme;
