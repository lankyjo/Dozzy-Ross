import { BackgroundImage, Box, Image, Skeleton } from "@mantine/core";

import React from "react";

type DetailImageProps = {
  image: string;
  isLoading?: boolean;
};

function DetailsandBlogBanner({ image, isLoading }: DetailImageProps) {
  return (
    <Box
      className={`  lg:rounded-[50px] relative m-auto w-[95%] h-[350px] md:h-[500px] lg:h-[532px] xl:h-[600px]  `}>
      {isLoading ? (
        <Skeleton className=" relative m-auto w-[95%] h-[350px] md:h-[500px] lg:h-[532px] xl:h-[600px] mt-[70px] lg:mt-[70px]" />
      ) : (
        <BackgroundImage
          src={image}
          className="w-[100%] h-[100%] m-auto  lg:rounded-[50px]">
          <Box className="absolute top-1/2 left-1/2  lg:rounded-[50px] transform -translate-x-1/2 -translate-y-1/2 h-[350px] md:h-[500px] lg:h-[532px] xl:h-[600px] w-[100vw] backdrop-filter backdrop-blur-xl flex justify-center items-center">
            <BackgroundImage src={image} className="w-[100%] h-[100%] m-auto">
              <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[350px] md:h-[500px] lg:h-[532px] xl:h-[600px] w-[100vw] backdrop-filter backdrop-blur-md flex justify-center items-center">
                <div className="  w-[70%] h-[350px] md:h-[500px] lg:h-[532px] xl:h-[600px] ">
                  <Image
                    src={image}
                    alt=""
                    loading="lazy"
                    className="h-[350px] md:h-[500px] lg:h-[532px] xl:h-[600px] "
                  />
                </div>
              </Box>
            </BackgroundImage>
          </Box>
        </BackgroundImage>
      )}

      <div></div>
    </Box>
  );
}

export default DetailsandBlogBanner;
