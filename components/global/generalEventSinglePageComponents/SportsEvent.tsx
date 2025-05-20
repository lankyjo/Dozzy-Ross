import { Box, Text } from "@mantine/core";
import { IconHeart, IconLink } from "@tabler/icons-react";
import Image from "next/image";

import React, { useRef } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import EventDesc from "./EventDesc";
import {
  imagePlaceholder,
  isEmpty,
  unavailable,
} from "@/components/utils/contextAPI/helperFunctions";

export default function SportsEvent({ event }: { event: SingleEventProps }) {
  const elementBRef = useRef<HTMLImageElement>(null);

  // Function to handle the click on Element A and trigger the click on Element B
  const handleElementAClick = () => {
    if (elementBRef.current) {
      elementBRef.current.click();
    }
  };

  return (
    <Box className=" my-10">
      <Box className="flex flex-col items-center justify-center mb-8">
        <Text
          c={"#171717"}
          className="rounded-lg m-auto text-secondary_color   font-medium   text-[17px] mt-[-4px]  md:text-[24px] font-poppins-medium">
          {event?.category?.name === "Sport & Games"
            ? event?.teamOne
            : event?.brideName}
        </Text>

        <Text
          c={"#171717"}
          className="rounded-lg m-auto  text-[17px] my-2  md:text-[19px] ">
          {event?.category?.name === "Sport & Games" ? "vs" : "🧡"}{" "}
        </Text>
        <Text
          c={"#171717"}
          className="rounded-lg m-auto text-secondary_color   font-medium   text-[17px] mt-[-4px]  md:text-[24px] font-poppins-medium">
          {event?.category?.name === "Sport & Games"
            ? event?.teamTwo
            : event?.groomName}
        </Text>
      </Box>
      {!isEmpty(event?.participantImages) && (
        <PhotoProvider>
          <Box className=" flex justify-center items-center relative">
            <div className="flex mr-2 justify-center flex-col items-center w-[150px] h-[150px] p-2 bg-slate-100   md:w-[250px] md:h-[250px] rounded-full   ">
              <div className="flex  justify-center flex-col items-center w-full h-full rounded-full   ">
                <PhotoView
                  src={event?.participantImages?.[0]?.url || imagePlaceholder}>
                  <Image
                    style={{ cursor: "pointer" }}
                    ref={elementBRef}
                    src={event?.participantImages?.[0]?.url || imagePlaceholder}
                    alt="sports"
                    fill
                    className="w-full h-full cursor-pointer rounded-full object-cover"
                  />
                </PhotoView>
              </div>
            </div>

            <div
              onClick={handleElementAClick}
              className=" cursor-pointer  md:p-2 p-2 bg-[white]  absolute z-10  flex  justify-center flex-col items-center rounded-full   border-secondary_color    border-2 ">
              {event?.category?.name === "Sport & Games" ? (
                <IconLink size={40} color=" #ef790d" className="  " />
              ) : (
                <IconHeart color="#ef790d" fill=" #ef790d" size={50} />
              )}
            </div>
            <div className="flex ml-2  justify-center flex-col items-center w-[150px] h-[150px] p-2 bg-slate-100   md:w-[250px] md:h-[250px] rounded-full   ">
              <div className="flex  justify-center flex-col items-center w-full h-full rounded-full   ">
                <PhotoView
                  src={event?.participantImages?.[1]?.url || imagePlaceholder}>
                  <Image
                    style={{ cursor: "pointer" }}
                    src={event?.participantImages?.[1]?.url || imagePlaceholder}
                    alt="sports"
                    fill
                    className="w-full h-full  rounded-full object-cover"
                  />
                </PhotoView>
              </div>
            </div>
          </Box>
        </PhotoProvider>
      )}

      {
        <Text
          c={"#171717"}
          className="  text-center rounded-lg m-auto  mt-4  md:mt-6   font-medium   text-[15px]   md:text-[19px] font-poppins-medium text-secondary_color  ">
          {event?.category?.name === "Sport & Games"
            ? `We would love to have you at ${
                event?.subCategory?.name || unavailable
              }`
            : `You are invited  as we celebrate our ${
                event?.subCategory?.name || unavailable
              }`}
        </Text>
      }

      <EventDesc description={event?.description || ""} />
    </Box>
  );
}
