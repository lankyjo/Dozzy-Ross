import { Box, Group, Text } from "@mantine/core";
import React from "react";
import LocationIcon from "@/components/icons/LocationIcon";
import ClockIcon from "@/components/icons/ClockIcon";
import {
  isEmpty,
  newDateFormatter,
  unavailable,
} from "@/components/utils/contextAPI/helperFunctions";
import PersonIcon from "@/components/icons/PersonIcon";
import VerifiedBadge from "@/components/icons/VerifiedBadge";

function EventDetails({
  event_title,
  venue,

  subCategory,

  startDate,
  endDate,
  ...event
}: SingleEventProps) {
  return (
    <Box className="flex flex-col justify-start item-start my-4">
      <Text
        c={"#171717"}
        fw={"bolder"}
        className="text-[17px] mt-[-4px]  md:text-[24px] ">
        {event_title || unavailable}
      </Text>

      <Text
        c={"#EF790D"}
        className=" capitalize  rounded-md  text-orange-400 mt-[-8px]  md:text-[15px]  lg:text-[17px] font-poppins-regular  ">
        {subCategory?.name || unavailable}
      </Text>
      <Group className="gap-1   mt-4 mb-2">
        <Text className="flex flex-row justify-center items-center text-[12px] md:text-[15px]  lg:text-[17px] font-poppins-medium">
          <PersonIcon />
        </Text>
        <Text
          c={"#171717"}
          className="flex items-center gap-1 text-text_label text-[12px] md:text-[15px] lg:text-[17px] font-poppins-regular ">
          {!isEmpty(event?.organizer?.username)
            ? event?.organizer?.username
            : " "}
          {event?.organizer?.isVerified && <VerifiedBadge />}
        </Text>
      </Group>
      <Box className="flex flex-row mb-2  justify-start  align-center     items-start   md:justify-center md:items-center  gap-1    lg:w-full     ">
        <LocationIcon />
        <Text
          c={"#171717"}
          className="text-[12px] md:text-[15px]  lg:text-[17px] font-poppins-regular text-text_label capitalize w-[170px]  md:w-full   flex ">
          {venue?.venue || unavailable}
        </Text>
      </Box>
      <Group gap={5} mb={6} my={6}>
        <Box className=" pt-2 flex justify-center items-center gap-1 flex-row mr-auto mt-[-10px]">
          <ClockIcon />{" "}
          <Text
            c={"#171717"}
            className=" text-[12px] md:text-[15px]  lg:text-[17px]  font-poppins-regular  text-[#2B3865CC] capitalize">
            {newDateFormatter(startDate)} - {newDateFormatter(endDate)}
          </Text>
        </Box>
      </Group>
    </Box>
  );
}

export default EventDetails;
