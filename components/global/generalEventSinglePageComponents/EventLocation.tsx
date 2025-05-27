import { Box, Group, Text } from "@mantine/core";
import React from "react";
import Image from "next/image";
import { mapImage } from "@/components/utils/contextAPI/helperFunctions";
import LocationIcon from "@/components/icons/LocationIcon";

function EventLocation({ event }: { event?: SingleEventProps }) {
  function openLocationOnGoogleMaps({ address }: { address: string }) {
    const query = `${address}`;
    const url = `https://www.google.com/maps?q=${encodeURIComponent(query)}`;
    window.open(url, "_blank");
  }

  return (
    <div>
      <Group className="relative flex flex-col mt-[10px] ">
        <Text
          fw={"bolder"}
          c={"#171717"}
          className="mr-auto text-[14px] md:text-[17px] lg:text-[20px] mt-[-4px]   font-poppins-semibold text-text_label "
        >
          Location
        </Text>

        {["online", "none"].includes(
          event?.eventLocationType?.toLowerCase()
        ) && (
          <Box className=" flex justify-center items-center gap-1 flex-row mr-auto mt-[-10px]">
            <LocationIcon />
            <p
              className="text-[#2b3865] text-[12px] md:text-[15px]  lg:text-[17px]  font-poppins-regular  capitalize"
              // c={"#2B3865CC"}
            >
              {event?.venue?.venue}
            </p>
          </Box>
        )}
      </Group>
      <Box className=" max-w-[600px]">
        {!["online", "none"].includes(
          event?.eventLocationType?.toLowerCase() || ""
        ) && (
          <div>
            <div className=" w-full relative h-[150px] md:h-[200px] ">
              <Image
                onClick={() =>
                  openLocationOnGoogleMaps({
                    address: event?.venue?.venue || "",
                  })
                }
                src={mapImage}
                alt=""
                className=" w-full cursor-pointer"
                fill
              />
              <div
                onClick={() =>
                  openLocationOnGoogleMaps({
                    address: event?.venue?.venue || "",
                  })
                }
                className="absolute bottom-3 left-1/2 transform -translate-x-1/2 p-1 py-1 px-2 bg-white rounded-md w-[95%]  flex justif-center items-center  whitespace-normal"
              >
                <p className="   items-baseline text-center flex mx-2    text-secondary_color cursor-pointer text-[12px] md:text-[15px]">
                  <LocationIcon />
                </p>
                <p className=" font-poppins-medium  items-baseline text-start flex mx-2 capitalize  text-secondary_color cursor-pointer text-[12px] md:text-[15px] ">
                  {event?.venue?.venue}
                </p>
              </div>
            </div>
          </div>
        )}
      </Box>
    </div>
  );
}

export default EventLocation;
