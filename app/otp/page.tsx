"use client";
import { Box, PinInput } from "@mantine/core";
import Link from "next/link";
import React from "react";

export default function OTP() {
  return (
    <section className="w-full h-dvh lg:p-0 md:p-10 p-5 relative flex justify-center items-center lg:text-gray-900 text-white">
      <div className="bg-white/30 backdrop-blur-xl w-full rounded-lg p-10 lg:p-0 lg:px-10 lg:py-6 lg:overflow-y-auto flex-1/2 space-y-2 flex justify-center items-center flex-col lg:space-y-3 lg:h-full lg:rounded-none lg:bg-white/90">
        <div className="w-full max-w-[574px] mx-auto ">
          <PinInput
            mb={80}
            className="flex justify-center items-center gap-2"
            type="number"
            aria-label="One time code"
            oneTimeCode
            value={""}
            onChange={(e) => console.log(e)}
            length={5}
            styles={{
              input: {
                borderColor: "#E4E7EC",
                border: "none",
                backgroundColor: "transparent",
                fontFamily: "poppins-regular",
                fontSize: 14,
                width: "100%",
                color: "#000",

                height: 80,
                borderRadius: "8px", // Add border-radius for rounded edges
                textAlign: "center", // Center the text
                transition: "border-color 0.2s ease-in-out",
                "&:focus": {
                  borderColor: "#4A90E2", // Change border color on focus
                  outline: "none",
                },
              },
              pinInput: {
                margin: "0 auto",
              },
            }}
          />

          <div className=" mt-10">
            <button className="w-full cursor-pointer text-white bg-primary py-3 rounded-lg">
              Continue
            </button>
          </div>
          <Box mt={16} mx={"auto"} className="flex justify-end">
            <p>
              Didn&apos;t receive code?
              <span className="text-primary">
                <Link href="/register"> Resend</Link>
              </span>
            </p>
          </Box>
        </div>
      </div>

      <div className="absolute select-none inset-0 -z-[1] lg:relative lg:flex-1/2 lg:h-full">
        <video className="w-full h-full object-cover" muted autoPlay loop>
          <source src="/placeholder1.mp4" />
        </video>
        {/* <div className="absolute flex p-4 flex-col justify-start items-end inset-0 bg-black/50 text-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src={"/logo.crop.png"} width={100} height={100} alt="logo" />
          </Link>
        </div> */}
      </div>
    </section>
  );
}
