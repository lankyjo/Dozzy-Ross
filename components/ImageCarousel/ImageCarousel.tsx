"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

type CMSImage = {
  image: {
    url: string;
    alt?: string;
  };
};

const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [images, setImages] = useState<CMSImage[]>([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/details");
      const landingDetails = await res.json();
      setImages(landingDetails.imageCarousel ?? []);
    })();
  }, []);

  useEffect(() => {
    if (isModalOpen || images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + (isMobile ? 1 : 2)) % images.length);
    }, 3_000);

    return () => clearInterval(timer);
  }, [isModalOpen, images.length, isMobile]);

  const totalSlides = Math.ceil(images.length / (isMobile ? 1 : 2));

  const goToPrevious = () => {
    setImageLoading(true);
    setCurrentIndex((i) => {
      const step = isMobile ? 1 : 2;
      return (i - step + images.length) % images.length;
    });
  };

  const goToNext = () => {
    setImageLoading(true);
    setCurrentIndex((i) => {
      const step = isMobile ? 1 : 2;
      return (i + step) % images.length;
    });
  };

  const openModal = (index: number) => {
    setModalIndex(index);
    setIsModalOpen(true);
  };

  if (images.length === 0) {
    return (
      <section className="w-full py-20 bg-black">
        <div className="contain text-white text-center">
          <p>Loading carousel…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-20 bg-black">
      <div className="contain">
        <h2 className="text-3xl font-anton font-bold text-white mb-10 text-center">
          Event Highlights
        </h2>

        {/* ─────────── Carousel (main view) ─────────── */}
        <div className="relative w-full h-[400px] overflow-hidden rounded-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex gap-4"
            >
              {/* First image */}
              <div
                className="relative flex-1 cursor-pointer"
                onClick={() => openModal(currentIndex)}
              >
                {images[currentIndex]?.image?.url && (
                  <Image
                    src={images[currentIndex].image.url}
                    alt={images[currentIndex].image.alt ?? "Event image"}
                    fill
                    onLoad={() => setImageLoading(false)}
                    className={`rounded-2xl object-cover transition-opacity duration-300 ${
                      imageLoading ? "opacity-0" : "opacity-100"
                    }`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
                <div className="absolute inset-0 bg-black/30 rounded-2xl" />
              </div>

              {/* Second image (desktop only) */}
              {!isMobile &&
                images[(currentIndex + 1) % images.length]?.image?.url && (
                  <div
                    className="relative flex-1 cursor-pointer hidden md:block"
                    onClick={() =>
                      openModal((currentIndex + 1) % images.length)
                    }
                  >
                    <Image
                      src={images[(currentIndex + 1) % images.length].image.url}
                      alt={
                        images[(currentIndex + 1) % images.length].image.alt ??
                        "Event image"
                      }
                      fill
                      className="rounded-2xl object-cover"
                      sizes="50vw"
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-2xl" />
                  </div>
                )}

              {/* Loader overlay */}
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 rounded-2xl">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-primary text-white p-2 rounded-full"
            aria-label="Previous image"
          >
            <IoIosArrowBack size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-primary text-white p-2 rounded-full"
            aria-label="Next image"
          >
            <IoIosArrowForward size={24} />
          </button>

          {/* dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => {
              const slideIndex = i * (isMobile ? 1 : 2);
              return (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageLoading(true);
                    setCurrentIndex(slideIndex);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    Math.floor(currentIndex / (isMobile ? 1 : 2)) === i
                      ? "bg-primary w-6"
                      : "bg-white/50"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ─────────── Modal ─────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="relative max-w-4xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* close */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-[-10px] right-0 text-white hover:text-primary"
              >
                <IoClose size={32} />
              </button>

              {/* arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalIndex(
                    (prev) => (prev - 1 + images.length) % images.length
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-primary text-white p-3 rounded-full"
                aria-label="Previous image"
              >
                <IoIosArrowBack size={28} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalIndex((prev) => (prev + 1) % images.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-primary text-white p-3 rounded-full"
                aria-label="Next image"
              >
                <IoIosArrowForward size={28} />
              </button>

              <div className="relative aspect-video">
                {images[modalIndex]?.image?.url && (
                  <Image
                    src={images[modalIndex].image.url}
                    alt={images[modalIndex].image.alt ?? "Event image"}
                    fill
                    className="rounded-lg object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
              </div>

              {/* dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalIndex(i);
                    }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      modalIndex === i ? "bg-primary w-6" : "bg-white/50"
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
