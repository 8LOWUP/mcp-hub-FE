"use client";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-0 rounded-md bg-surface-3 hover:bg-surface-3/10 dark:hover:bg-white/10"
            aria-label="Toggle theme"
        >
            <Image
                src="/theme.svg"
                alt="Toggle theme"
                width={28}
                height={28}
                priority
            />

        </button>
    );

}