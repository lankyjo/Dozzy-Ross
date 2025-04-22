import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import PlayBtn from "../PlayBtn";
import useAppContext from "../utils/hooks/useAppContext";

const Moments = () => {
  const { classifyEvents } = useAppContext();

  // Define the event data array with video URLs
  const events =
    classifyEvents?.past?.length > 3
      ? classifyEvents?.past?.slice(0, 3)
      : classifyEvents?.past;

  // const eventVideos = events?.map((event, i) => ({
  //   id: event.event_title || `event-${i + 1}`,
  //   videoUrl:
  //     "https://res.cloudinary.com/isreal/video/upload/v1745280918/Afrobeat%20miami/Snapins.ai_video_AQMQ_i01Tkxvghir-TxD5XCkr2UcD41fMWZANb395Yi4Uos3B3q9-CxZfsNvgylx2OSAqcasbwGkVX7mFL6LJkfqL_0vHe7oB5L2vNI_mnr2r1.mp4",
  //   img: event.banner?.url || "/wizkid.webp",
  // }));

  const eventVideos = [
    {
      id: "Afro Events Miami",
      videoUrl:
        "https://res.cloudinary.com/isreal/video/upload/v1745297768/Afrobeat%20miami/C0010_1_eo59gx.mov",
      img: "https://res.cloudinary.com/isreal/image/upload/v1745260792/Afrobeat%20miami/IMG_6033_hh4tkq.jpg",
    },
    {
      id: "Watawi for the culture",
      videoUrl:
        "https://res.cloudinary.com/isreal/video/upload/v1745297758/Afrobeat%20miami/watawimiami_fhhwso.mp4",
      img: "https://res.cloudinary.com/isreal/image/upload/v1745260519/Afrobeat%20miami/IMG_6024_eudby7.jpg",
    },
    {
      id: "Fusion Returns",
      videoUrl:
        "https://res.cloudinary.com/isreal/video/upload/v1745297755/Afrobeat%20miami/Fuzi%CC%81on_Returns_sglsj9.mp4",
      img: "https://res.cloudinary.com/isreal/image/upload/v1745260526/Afrobeat%20miami/IMG_6025_wkbeak.jpg",
    },
  ];
  // State to track which video is playing
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  return (
    <section
      className="padding py-36 text-white"
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(/countdownbg.jpg)`,
      }}
    >
      <div className="contain grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-5">
          <h2 className="text-3xl font-anton font-bold">
            Live the Moment Again and Again
          </h2>
          <p>
            Missed the show ? Or simply want to experience it all over again?
            Dive into our exclusive collection of Event videos.
          </p>
          <a
            href="https://www.instagram.com/afroevents_miami?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-bold hover:underline"
          >
            See more
          </a>
        </div>

        {/* Map through event data and render VideoCard for each */}

        {eventVideos.map((event) => (
          <VideoCard
            key={event.id}
            video={event}
            isPlaying={playingVideo === event.id}
            onPlay={() => setPlayingVideo(event.id)}
            onPause={() => setPlayingVideo(null)}
            playingVideo={playingVideo}
            setPlayingVideo={setPlayingVideo}
          />
        ))}
      </div>
    </section>
  );
};

export default Moments;

type VideoProps = {
  video: { id: string; videoUrl: string; img: string };
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  playingVideo: string | null;
  setPlayingVideo: React.Dispatch<React.SetStateAction<string | null>>;
};

// VideoCard component that shows the image and plays the video when clicked
const VideoCard: React.FC<VideoProps> = ({
  video,
  isPlaying,
  onPlay,
  onPause,
  setPlayingVideo,
}) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  // Click outside handler to reset the video
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

  // Handle video playback
  useEffect(() => {
    if (videoPlayerRef.current) {
      if (isPlaying) {
        videoPlayerRef.current.play();
      } else {
        videoPlayerRef.current.pause();
      }
    }
  }, [isPlaying]);

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
          <Image
            src={video.img}
            alt="Video thumbnail"
            layout="fill"
            className="w-full h-full absolute object-cover"
          />
        </>
      ) : (
        <video
          ref={videoPlayerRef}
          className="w-full h-full rounded-3xl object-cover"
          src={video.videoUrl}
          controls
          autoPlay
          onEnded={onPause}
        />
      )}
    </div>
  );
};
