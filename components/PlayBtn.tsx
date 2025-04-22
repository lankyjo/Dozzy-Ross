import React from 'react';
import { FaPlay } from 'react-icons/fa';

interface PlayBtnProps {
  onClick: () => void;
}

const PlayBtn: React.FC<PlayBtnProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
    >
      <style jsx>{`
        @keyframes custom-pulse {
          0% {
            transform: scale(0.8);
            box-shadow: 0 0 0 0 rgba(239, 121, 13, 1);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 60px rgba(239, 121, 13, 0);
          }
          100% {
            transform: scale(0.8);
          }
        }
        .custom-pulse {
          animation: custom-pulse 2s infinite;
          background-color: rgb(239, 121, 13);
        }
      `}</style>
      <div className="h-14 w-14 rounded-full flex justify-center items-center custom-pulse">
        <FaPlay className="text-white" size={20} />
      </div>
    </div>
  );
};

export default PlayBtn;
