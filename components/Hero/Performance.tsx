import { Avatar } from "@mantine/core";
import React, { useEffect, useState } from "react";

export default function Performance({
  count,
  title,
  images,
}: {
  count: number;
  title: string;
  images: [string, string, string];
}) {
  const [value, setValue] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Set initial window width
    setWindowWidth(window.innerWidth);

    // Add event listener for window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setTimeout(() => {
      setValue((prev) => prev + 1);
    }, 2);

    if (value >= count) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [value, count]);

  return (
    <div className="relative -z-10 flex md:flex-col justify-between mb-[30px] gap-5">
      <Avatar.Group>
        {images?.map((image, index) => (
          <Avatar
            key={index}
            src={image}
            className="rounded-full border-4 border-[#F4F2F2] "
            size={windowWidth >= 1024 ? 65 : 50}
            radius="xl"
            styles={{
              root: {
                border: `${
                  windowWidth >= 1024
                    ? "3px solid #F4F2F2"
                    : "2px solid #F4F2F2"
                }`, // Off-white border
              },
            }}
          />
        ))}
      </Avatar.Group>
      <div className="flex gap-4  items-center  justify-start max-w-[14rem]  w-full">
        <div className="  ml-0">
          <h3 className=" text-[1.7rem] md:text-3xl font-extrabold self-center ">
            {value}
            <span className=" text-[1.7rem] font-extrabold  ">+</span>
          </h3>
        </div>
        <div className="w-full">
          <p className=" text-sm md:text-xl           self-center   ">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
