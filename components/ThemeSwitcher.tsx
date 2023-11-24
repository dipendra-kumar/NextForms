"use client";
import { Tabs, TabsList } from "@radix-ui/react-tabs";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { TabsTrigger } from "./ui/tabs";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const themeData = [
    {
      mode: "light",
      icon: <SunIcon />,
    },
    {
      mode: "dark",
      icon: <MoonIcon className="rotate-90 transition-all dark:rotate-0" />,
    },
    {
      mode: "system",
      icon: <DesktopIcon />,
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // avoid rehydration errors
  return (
    <Tabs defaultValue={theme}>
      <TabsList className="border">
        {themeData.map((ui, index) => (
          <TabsTrigger
            key={index}
            value={ui.mode}
            onClick={() => setTheme(ui.mode)}
            className={`h-10 w-12  rounded-none ${
              theme === ui.mode
                ? "bg-transparent"
                : " bg-[#aaaaaa] dark:bg-[#1c1917]"
            } hover:scale-110`}
          >
            {ui.icon}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default ThemeSwitcher;
