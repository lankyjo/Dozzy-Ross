// src/components/VideoCard.tsx
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import PlayBtn from "./PlayBtn";

type VideoProps = {
  video: { id: string; videoUrl: string; img: string };
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  playingVideo: string | null;
  setPlayingVideo: React.Dispatch<React.SetStateAction<string | null>>;
};

const VideoCard: React.FC<VideoProps> = ({
  video,
  isPlaying,
  onPlay,
  //   onPause,
  //   playingVideo,
  setPlayingVideo,
}) => {
  const videoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        videoRef.current &&
        !videoRef.current.contains(event.target as Node)
      ) {
        setPlayingVideo(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setPlayingVideo]);

  // Validate videoUrl, ensure it's not an empty string or null
  const isValidVideoUrl = video.videoUrl && video.videoUrl.trim() !== "";

  return (
    <div
      ref={videoRef}
      className="relative text-white p-4 overflow-hidden lg:aspect-video aspect-square rounded-3xl"
    >
      {!isPlaying ? (
        <>
          <p className="z-20 relative capitalize">{video.id}</p>
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <PlayBtn onClick={onPlay} />
          </div>
          {/* Display a thumbnail or placeholder image */}
          <Image
            src={video.img} // Replace with appropriate image for each event
            alt="Video thumbnail"
            layout="fill"
            className="w-full h-full absolute object-cover"
          />
        </>
      ) : isValidVideoUrl ? ( // Only render iframe if the videoUrl is valid
        <iframe
          className="w-full h-full rounded-3xl"
          src={`${video.videoUrl}?autoplay=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white">
          Video not available
        </div>
      )}
    </div>
  );
};

export default VideoCard;
