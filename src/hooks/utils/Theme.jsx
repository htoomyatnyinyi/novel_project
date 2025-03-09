import { useEffect, useState } from "react";
import { AiFillSun, AiFillMoon } from "react-icons/ai";

const Theme = () => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage or system preference on initial load
    if (localStorage.theme) return localStorage.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  useEffect(() => {
    // Apply the theme to the document
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button onClick={toggleTheme} className="p-2 text-xl m-1">
      {theme === "light" ? <AiFillMoon /> : <AiFillSun />}
    </button>
  );
};

export default Theme;
