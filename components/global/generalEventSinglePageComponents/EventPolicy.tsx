import { Box, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";

function EventPolicy() {
  return (
    <Box className=" relative max-w-[600px] mt-[40px]">
      <Text className="text-[14px] mt-[-4px]  md:text-[20px] font-poppins-semibold text-text_label">
        Refund policy
      </Text>
      <Box className="flex justify-start items-center">
        <Text className="flex-wrap py-[8px]  text-[14px] md:text-[15px]  lg:text-[17px] font-poppins-regular  rounded-md">
          Click here to see our
        </Text>
        <Text
          className="flex-wrap p-[8px] text-secondary_color  text-[14px] md:text-[15px]  lg:text-[17px] font-poppins-regular  rounded-md"
          component={Link}
          href="/policies#refund"
        >
          Refund policy
        </Text>
      </Box>
    </Box>
  );
}

export default EventPolicy;
