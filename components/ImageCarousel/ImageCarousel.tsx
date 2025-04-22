import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const images = [
  {
    url: "https://res.cloudinary.com/isreal/image/upload/v1745260526/Afrobeat%20miami/IMG_6025_wkbeak.jpg",
    alt: "Event 1",
  },
  {
    url: "https://res.cloudinary.com/isreal/image/upload/v1745260519/Afrobeat%20miami/IMG_6027_lqqvth.jpg",
    alt: "Event 2",
  },
  {
    url: "https://res.cloudinary.com/isreal/image/upload/v1745260522/Afrobeat%20miami/IMG_6031_jddomi.jpg",
    alt: "Event 3",
  },
  {
    url: "https://res.cloudinary.com/isreal/image/upload/v1745260524/Afrobeat%20miami/IMG_6028_ox2lf8.jpg",
    alt: "Event 4",
  },
  {
    url: "https://res.cloudinary.com/isreal/image/upload/v1745260521/Afrobeat%20miami/IMG_6030_pbu6q9.jpg",
    alt: "Event 5",
  },
];

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isModalOpen]);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <section className="w-full py-20 bg-black">
      <div className="contain">
        <h2 className="text-3xl font-anton font-bold text-white mb-10 text-center">
          Event Highlights
        </h2>
        <div className="relative w-full h-[400px] overflow-hidden rounded-2xl cursor-pointer">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
              onClick={handleImageClick}
            >
              <Image
                src={images[currentIndex].url}
                alt={images[currentIndex].alt}
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
              <div className="absolute inset-0 bg-black/30 rounded-2xl" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-primary text-white p-2 rounded-full transition-colors"
            aria-label="Previous image"
          >
            <IoIosArrowBack size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-primary text-white p-2 rounded-full transition-colors"
            aria-label="Next image"
          >
            <IoIosArrowForward size={24} />
          </button>

          {/* Navigation dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex === index ? "bg-primary w-6" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="relative max-w-4xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute -top-12 right-0 text-white hover:text-primary transition-colors"
              >
                <IoClose size={32} />
              </button>

              {/* Modal navigation arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-primary text-white p-3 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <IoIosArrowBack size={28} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-primary text-white p-3 rounded-full transition-colors"
                aria-label="Next image"
              >
                <IoIosArrowForward size={28} />
              </button>

              <div className="relative aspect-video">
                <Image
                  src={images[currentIndex].url}
                  alt={images[currentIndex].alt}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>

              {/* Modal navigation dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentIndex === index ? "bg-primary w-6" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ImageCarousel;
