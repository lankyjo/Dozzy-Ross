import IconFailure from "@/components/icons/IconFailure";
import { Box, Button, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";

function ErrorComponent({
  title1,
  title2,
  link,
  buttonTitle,
}: {
  title1: string;
  title2: string;
  link?: string;
  buttonTitle: string;
}) {
  const router = useRouter();
  return (
    <Box className="bg-[#FEF9F4]  py-[70px] px-6">
      <Box className="flex flex-col justify-center items-center">
        <IconFailure />
        <Text className="text-center text-[red] mt-4 font-poppins-medium text-[15px] md:text-[24px]">
          {title1}
        </Text>
        <Text className="text-center text-[red] font-poppins-regular text-[10px] md:text-[14px]">
          {title2}
        </Text>
        <Box className=" w-[70%] md:w-[35%] max-w-[220px] mt-6 justify-around items-center relative cursor-pointer">
          <Button
            onClick={() => router.push(link || "")}
            loading={false}
            color="gray.0"
            type="submit"
            fullWidth
            variant="white"
            className="bg-secondary_color m-auto text-[15px] md:text-[17px] capitalize font-poppins-regular md:text-lg text-white rounded-full w-full  h-[40px] md:h-[57px]">
            {buttonTitle}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ErrorComponent;
