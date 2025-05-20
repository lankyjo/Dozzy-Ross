import { Box, Text } from "@mantine/core";
import React from "react";

function AcceptedCurrency({ currency }: { currency: string }) {
  return (
    <Box className="flex flex-row w-full flex-wrap justify-start items-center gap-2 md:mt-[-8px]">
      <Text
        c="#171717"
        className="text-[14px]   font-poppins-regular space-x-2 text-text_label capitalize">
        currency accepted
      </Text>
      <Text
        c="#171717"
        className="bg-[#E0E6EECC] hover:bg-[#2B3865CC] hover:text-[#FFF] p-[2px] h-[22px] min-w-[35px]  text-[#2B3865CC] text-center justify-center font-poppins-regular text-[12px] rounded-md cursor-pointer">
        {currency}
      </Text>
    </Box>
  );
}

export default AcceptedCurrency;
