import { Box, Text } from "@mantine/core";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";

export default function EventPhotos({ images }: { images: { url: string }[] }) {
  return (
    <PhotoProvider>
      <Box className="my-[40px]  mb-[80px]">
        <Text
          fw={"bolder"}
          className="text-[14px] mb-[10px]  md:text-[20px] font-poppins-semibold text-text_label">
          Photos
        </Text>

        <div className="relative    w-60 h-60 md:w-80- md:h-80-">
          {images.map((item, index) => (
            <PhotoView key={index} src={item.url}>
              {index < 4 ? (
                <Image
                  fill
                  className="absolute top-0 left-0 w-full rounded-lg h-full object-cover cursor-pointer transition-transform duration-200 hover:scale-105"
                  style={{
                    left: `${index * 50}px`,
                    top: `${index * 0}px`,
                    zIndex: index,
                    transition: "z-index 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLImageElement).style.zIndex = "10";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.zIndex =
                      index.toString();
                  }}
                  src={item.url}
                  alt={`image-${index}`}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : undefined}
            </PhotoView>
          ))}
        </div>
      </Box>
    </PhotoProvider>
  );
}
