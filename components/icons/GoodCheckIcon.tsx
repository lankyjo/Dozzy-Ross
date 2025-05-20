import React from "react";

function GoodCheckIcon({
  fill = "#1EB649",
  stroke = "#1EB649",
  size = "20",
}: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 19 20"
      fill="none">
      <path
        d="M16.6875 10C16.6875 6.16992 13.5801 3.0625 9.75 3.0625C5.91992 3.0625 2.8125 6.16992 2.8125 10C2.8125 13.8301 5.91992 16.9375 9.75 16.9375C13.5801 16.9375 16.6875 13.8301 16.6875 10Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="0.185"
        strokeMiterlimit="10"
      />
      <path
        d="M13.2188 7.10938L8.3625 12.8906L6.28125 10.5781"
        stroke="white"
        strokeWidth="0.986667"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default GoodCheckIcon;
