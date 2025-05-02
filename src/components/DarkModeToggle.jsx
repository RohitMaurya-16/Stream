import { useEffect, useState } from "react";

const DarkModeToggle = () => {
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage and system preference
        const savedTheme = localStorage.getItem("darkMode");
        if (savedTheme !== null) {
            return savedTheme === "true";
        }
        // If no saved preference, use system preference
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        // Update body classes
        if (darkMode) {
            document.body.classList.add("dark-mode");
            document.body.classList.remove("light-mode");
            localStorage.setItem("darkMode", "true");
        } else {
            document.body.classList.add("light-mode");
            document.body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "false");
        }
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="theme-toggle"
            aria-label="Toggle dark mode"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
            {darkMode ? (
                <span className="theme-toggle-icon">☀️</span>
            ) : (
                <span className="theme-toggle-icon">🌙</span>
            )}
        </button>
    );
};

export default DarkModeToggle; 