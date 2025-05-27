"use client";
import Link from "next/link";
export default function NavItem({ close }: { close?: () => void }) {
  return (
    <ul className="gap-4 flex flex-col md:flex-row md:gap-10">
      {["home", "contact"]?.map((link) => {
        const href =
          link === "contact" ? "#contact" : link === "home" ? "/" : `/${link}`;
        return (
          <li className="font-semibold uppercase" key={link}>
            <Link href={href}>
              <span onClick={() => close?.()}>{link}</span>{" "}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
