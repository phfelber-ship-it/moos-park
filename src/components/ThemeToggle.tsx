"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Helles Design aktivieren" : "Dunkles Design aktivieren"}
      className={`relative flex h-9 w-16 shrink-0 items-center rounded-full p-1 shadow-[var(--header-shadow)] transition-colors duration-300 ${
        dark ? "bg-foreground/20" : "bg-accent-lime/30"
      }`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full bg-background text-foreground shadow-md transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          dark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {dark ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
            <path
              d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
