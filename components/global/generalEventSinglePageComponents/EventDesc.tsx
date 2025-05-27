import { Box, Text } from "@mantine/core";
import React, { useState } from "react";
interface Props {
  description: string;
}

function EventDesc({ description }: Props) {
  const [readDsc, setReadDsc] = useState<boolean>(false);
  // Function to toggle the expansion of the text
  const toggleTextExpansion = () => {
    setReadDsc((prevIsExpanded) => !prevIsExpanded);
  };
  const textSample = description;
  const displayedText = readDsc ? textSample : textSample?.slice(0, 150);

  // Function to preserve line breaks in text
  const formatText = (text: string) => {
    return text?.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <Box className=" relative  ">
      <Box className="flex flex-row gap-1 items-center flex-wrap p-[8px] lg:p-[12px] text-[14px] md:text-[15px] lg:text-[17px]  mt-[5px] bg-[#F6F9FE] font-poppins-regular  rounded-md">
        <Text
          c={"#171717"}
          className="text-primary_color text-[14px] md:text-[15px] lg:text-[17px]">
          {formatText(displayedText)}
        </Text>
        {textSample?.length < 150 ? null : (
          <Text
            c={"#171717"}
            onClick={toggleTextExpansion}
            className="text-secondary_color_hover text-[14px] md:text-[15px] lg:text-[17px] cursor-pointer">
            {readDsc ? "See less" : "See more . . ."}{" "}
          </Text>
        )}
      </Box>
    </Box>
  );
}

export default EventDesc;
