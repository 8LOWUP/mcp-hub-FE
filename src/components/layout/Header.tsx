"use client";

import { useEffect, useState } from "react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 shadow-md"
    >
      <div className={`absolute top-0 left-0 right-0 z-20 h-20 bg-blue-400 border-b-4 border-blue-400 transition-colors duration-200 ${
        scrolled ? "border-b-4 border-orange-400" : ""
      }`}>
          <div className="mx-auto max-w-screen-2xl px-4 py-3">
            <h1 className="text-lg font-semibold">해더입니다</h1>
          </div>
      </div>
    </header>
  );
};

export default Header;