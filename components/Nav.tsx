"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Nav = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const opacity = Math.min(scrollY / 200, 1);
  const buttonOpacity = Math.min((scrollY - 50) / 150, 1);

  return (
    <header
      className="fixed top-0 w-full p-4 transition-all duration-300 z-50"
      style={{ backgroundColor: `rgba(75, 85, 99, ${opacity})` }}
    >
      <nav className="flex justify-between">
        <div id="logo" className="flex items-center gap-10">
          <h1 className="text-3xl uppercase font-bold">
            <span className="text-primary">O</span>rganizer
          </h1>

          <ul className="flex gap-4">
            {["home", "about", "page", "post", "contact"].map((link) => (
              <li className="font-semibold uppercase" key={link}>
                <Link href={`/${link === "home" ? "" : link}`}>{link}</Link>
              </li>
            ))}
          </ul>
        </div>

        <button
          id="CTA"
          className="px-5 py-2 bg-primary text-gray-950 rounded-3xl cursor-pointer duration-300 hover:text-white"
          style={{ opacity: buttonOpacity }}
        >
          <Link href="/">Get started</Link>
        </button>
      </nav>
    </header>
  );
};

export default Nav;
