"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeSwitch = () => {
  const { setTheme, theme } = useTheme();

  return theme === "dark" ? (
    <button
      onClick={() => setTheme("light")}
      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted"
    >
      <SunIcon />
    </button>
  ) : (
    <button
      onClick={() => setTheme("dark")}
      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted"
    >
      <MoonIcon />
    </button>
  );
};
