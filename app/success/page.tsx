"use client";
import { Box, Text, Button, Container } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import Confetti from "react-confetti";
import Cookies from "js-cookie";
import GoodCheckIcon from "@/components/icons/GoodCheckIcon";
import Link from "next/link";
import useGetter from "@/components/utils/hooks/useGetter";

export default function TicketSuccess() {
  const { height, width } = useViewportSize();
  const token = Cookies.get("access_token");
  const { data, isLoading } = useGetter(token ? "user" : null);
  return (
    <>
      <main className="w-full min-h-screen  flex justify-center  items-center">
        <Container size={2000} px={0}>
          <Box className="w-full flex my-auto   h-[80vh]   p-4 items-center justify-center lg:py-10 ">
            <Box className="w-full md:max-w-[664px] bg-[whitesmoke] p-[20px] md:p-[45px] rounded-md">
              <div className="flex justify-center">
                <GoodCheckIcon size={"100"} />
              </div>

              <Text
                c={"#171717"}
                fw={"bolder"}
                className="text-[17px]   md:text-[24px]  text-center">
                {token && !isLoading && `Hello ${data?.data?.username}`}
                {!token && `Congratulations!`}
              </Text>

              <Box className="flex flex-col justify-center items-center w-full h-full my-6">
                <Text
                  c={"#171717"}
                  className="text-center text-xs md:text-[15px]  lg:text-[17px] font-poppins-regular text-text_label    md:w-full ">
                  Your reservation has been made. Thank you for using our
                  platform.
                </Text>

                <Text
                  c={"#171717"}
                  className="text-xs md:text-[15px] mt-4  lg:text-[17px] font-poppins-regular text-text_label   md:w-full  text-center">
                  A copy has been sent to your email.
                </Text>
              </Box>
              <div className=" flex justify-center w-full">
                <Link href={"/"} className="">
                  <Button
                    size="md"
                    bg="#171717"
                    maw={200}
                    c="white"
                    type="submit"
                    variant="white"
                    className="bg-secondary_color font-poppins-semibold text-lg capitalize text-white rounded-lg w-full md:max-w-[50%]">
                    Okay
                  </Button>
                </Link>
              </div>
            </Box>
          </Box>
        </Container>
      </main>

      <Confetti width={width} height={height} />
    </>
  );
}
