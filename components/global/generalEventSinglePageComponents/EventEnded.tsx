import ClosedEventIcon from "@/components/icons/ClosedEventIcon";
import { Box, Button, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";

function EventEnded({
  title1,
  title2,
  link,
}: {
  title1: string;
  title2: string;
  link?: string;
}) {
  const router = useRouter();
  return (
    <Box className="bg-[#FEF9F4]  py-[70px] px-6">
      <Box className="flex flex-col justify-center items-center">
        <ClosedEventIcon />
        <Text
          fw={"bold"}
          className="text-center text-[#0B032D] mt-4 font-poppins-medium text-[15px] md:text-[24px]">
          {title1}
        </Text>
        <Text className="text-center text-[#2b3865a3] font-poppins-regular text-[10px] md:text-[14px]">
          {title2}
        </Text>
        <Box className=" w-[70%] md:w-[35%] max-w-[220px] mt-6 justify-around items-center relative cursor-pointer">
          <Button
            onClick={() => router.push(link || "/")}
            loading={false}
            bg="#171717"
            c="white"
            type="submit"
            fullWidth
            variant="white"
            className="bg-secondary_color m-auto text-[15px] md:text-[17px] capitalize font-poppins-regular md:text-lg text-white rounded-full w-full  h-[40px] md:h-[57px]">
            See similar events
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default EventEnded;
