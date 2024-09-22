"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import Button from "../../Elements/Button";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <Button
      classname="rounded-full text-xl md:text-2xl  transition duration-300  hover:rotate-180  hover:text-slate-300"
      onclick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? "🌞" : "🌚"}
    </Button>
  );
};

export default ThemeSwitch;
