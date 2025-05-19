import React from "react";

function ArrowDownIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="text-secondary_color transition-transform duration-300 ease-in-out">
      <path
        d="M6 9L12 15L18 9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowUpIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="text-secondary_color transition-transform duration-300 ease-in-out">
      <path
        d="M18 15L12 9L6 15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ArrowDownIcon;
