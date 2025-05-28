import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import PlayBtn from "../PlayBtn";

type ShowCaseData = {
  socialLink: string;
  videos: {
    id: string;
    videoTitle: string;
    videoUrl: string;
    VideoThumbnail: string;
  }[];
};

const Moments = () => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [momentsData, setMomentsData] = useState<ShowCaseData | null>(null);

  useEffect(() => {
    async function getLanding() {
      try {
        const res = await fetch("/api/details");
        const data = await res.json();
        setMomentsData(data.showCase ?? null);
      } catch (error) {
        console.error("Failed to fetch showCase data:", error);
      }
    }
    getLanding();
  }, []);

  return (
    <>
      {momentsData?.videos && momentsData.videos.length > 0 && (
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
                Missed the show? Or simply want to experience it all over again?
                Dive into our exclusive collection of event videos.
              </p>
              {momentsData?.socialLink && (
                <a
                  href={momentsData?.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-bold hover:underline"
                >
                  See more
                </a>
              )}
            </div>
            {momentsData?.videos && momentsData.videos.length > 0 && (
              <>
                {momentsData.videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={{
                      id: video.videoTitle,
                      videoUrl: video.videoUrl,
                      img: video.VideoThumbnail,
                    }}
                    isPlaying={playingVideo === video.videoTitle}
                    onPlay={() => setPlayingVideo(video.videoTitle)}
                    onPause={() => setPlayingVideo(null)}
                    playingVideo={playingVideo}
                    setPlayingVideo={setPlayingVideo}
                  />
                ))}
              </>
            )}
          </div>
        </section>
      )}
    </>
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

const VideoCard: React.FC<VideoProps> = ({
  video,
  isPlaying,
  onPlay,
  onPause,
  setPlayingVideo,
}) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  // Click outside to stop video
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

  // Auto play/pause
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
      className="relative text-white p-4 overflow-hidden lg:aspect-video aspect-square rounded-3xl border-[0.5px] border-white"
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
            className="w-full h-full absolute object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
