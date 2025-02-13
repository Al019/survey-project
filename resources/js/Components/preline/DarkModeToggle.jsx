import { useState, useEffect } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@material-tailwind/react";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("hs_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDark =
      storedTheme === "dark" ||
      (storedTheme === "auto" && prefersDark);

    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    localStorage.setItem("hs_theme", newTheme);
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  return (
    <IconButton onClick={toggleTheme} className="hs-dark-mode" variant="text">
      {isDarkMode ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
    </IconButton>
  );
};

export default DarkModeToggle