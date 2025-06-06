import { useViewportSize } from "@mantine/hooks";
import React from "react";

function TwitterIcon() {
  const { width } = useViewportSize();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width > 700 ? 25 : 20}
      height={width > 700 ? 25 : 20}
      viewBox="0 0 50 50"
      fill="none">
      <path
        d="M37.9271 4.6875H44.8187L29.7625 21.8958L47.475 45.3125H33.6042L22.7417 31.1104L10.3125 45.3125H3.41667L19.5208 26.9062L2.53125 4.6875H16.75L26.5687 17.6687L37.9271 4.6875ZM35.5083 41.1875H39.3271L14.6771 8.59583H10.5792L35.5083 41.1875Z"
        fill="black"
      />
    </svg>
  );
}

export default TwitterIcon;
