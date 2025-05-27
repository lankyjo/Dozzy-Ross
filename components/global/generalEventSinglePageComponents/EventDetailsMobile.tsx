import { Box, Group, Text } from "@mantine/core";
import React from "react";
import { CheckCountDaown, EventCountDawnNewComponent } from "./EventCountdown";

import LocationIcon from "@/components/icons/LocationIcon";

import {
  // isEmpty,
  localTimeISO,
  newDateFormatter,
  unavailable,
} from "@/components/utils/contextAPI/helperFunctions";

export default function EventDetailsMobile({ ...event }: SingleEventProps) {
  return (
    <Box className=" mb-8 bg-white     w-full flex flex-col md:hidden  items-center  justify-evenly ">
      <Box
        mt={-60}
        className="bg-white gap-3 w-[90%]  px-3 py-6 md:p-6 shadow-md shadow-gray-600 rounded-lg   flex flex-col items-center  justify-evenly"
      >
        <>
          <Text
            fw={"bolder"}
            c={"#171717"}
            className="text-center text-[17px] capitalize   md:text-[24px] font-poppins-semibold text-primary_color_70"
          >
            {event?.event_title || unavailable}
          </Text>

          <Group className="relative flex flex-col  justify-start my-1">
            <Box className="  capitalize px-2 rounded-md  bg-orange-200       flex justify-center items-center gap-1 flex-row  mt-[-10px]">
              <p
                // c={"#171717"}
                className="  text-[#171717] text-[13px] md:text-[15px]  lg:text-[17px] font-poppins-regular text-text_label "
              >
                {event?.subCategory?.name || unavailable}
              </p>
            </Box>
          </Group>

          {/* <Box
            mt={4}
            mb={10}
            className="flex flex-row justify-center items-center"
          >
            <Box className="flex justify-center mr-1 items-center text-[13px] md:text-[15px]  lg:text-[17px] font-poppins-medium">
              <PersonIcon />
            </Box>
            <p
              className="flex text-[#171717] items-center gap-1 text-[12px] md:text-[15px] lg:text-[17px] font-poppins-regular "
            >
              Organizer:{" "}
              {!isEmpty(event?.organizer?.username)
                ? event?.organizer?.username
                : ""}
              {event?.organizer?.isVerified && <VerifiedBadge />}
            </p>
          </Box> */}
          <Group className="relative mt-4 flex flex-col  justify-start   my-1 ">
            <Box className="rounded-md   bg-slate-100  w-full   p-1  text-center px-2  flex justify-center items-center gap-1 flex-row  mt-[-10px]">
              <p className="text-[12px] md:text-[15px] text-[#171717] lg:text-[17px] font-poppins-regular text-text_label ">
                {newDateFormatter(event?.startDate)} -{" "}
                {newDateFormatter(event?.endDate)}
              </p>
            </Box>
          </Group>

          <Box className="text-center flex  w-full justify-center  items-start gap-1  my-1 ">
            <span>
              <LocationIcon />
            </span>
            <p
              // c={"#171717"}
              className="text-center text-[#171717] text-[12px] md:text-[15px]  lg:text-[17px] font-poppins-regular text-text_label capitalize  "
            >
              {event?.venue?.venue || unavailable}
            </p>
          </Box>

          <Box
            c={"#171717"}
            className="flex w-full  flex-col items-center justify-center mx-auto my-1"
          >
            {(new Date(localTimeISO) > new Date(event?.startDate) &&
              new Date(localTimeISO) < new Date(event?.endDate)) ||
            new Date(localTimeISO) > new Date(event?.endDate) ||
            event?.status?.toLowerCase() !== "published" ? null : (
              <div className="flex  mx-auto">
                <EventCountDawnNewComponent
                  count_down={new Date(event?.startDate)}
                />
              </div>
            )}

            <CheckCountDaown
              startDate={new Date(event?.startDate)}
              endDate={new Date(event?.endDate)}
              status={event?.status || ""}
            />
          </Box>
        </>
      </Box>
    </Box>
  );
}
