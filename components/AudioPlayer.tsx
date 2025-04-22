import React, { useRef, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

interface AudioPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  isPlaying,
  onPlay,
  onPause,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", onPause);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("ended", onPause);
        }
      };
    }
  }, [onPause]);

  return (
    <div className="relative w-full h-full">
      <audio ref={audioRef} src={audioUrl} />
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="h-14 w-14 rounded-full flex justify-center items-center bg-primary hover:bg-primary/80 transition-colors"
        >
          {isPlaying ? (
            <FaPause className="text-white" size={20} />
          ) : (
            <FaPlay className="text-white" size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
