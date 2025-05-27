import React, { useState, useEffect, useRef } from "react";
import Performance from "./Performance";
import { Box } from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import Loader from "../utils/Loader";

const Hero = () => {
  // const [videoSrc, setVideoSrc] = useState("");
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);

  // A USE EFFECT TO GET DETAILS FROM THE CMS
  useEffect(() => {
    async function getLanding() {
      const res = await fetch("/api/details");
      const landingDetails = await res.json();
      setDetails(landingDetails);
    }
    getLanding();
  }, []);

  // USE EFFECT TO STOP SCROLLING WHILE LOADING CMS DATA
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  // USE EFFECT FOR RESPONSIVE IMAGE POSITIONING
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        if (window.innerWidth < 768) {
          // Mobile positioning
          imageRef.current.style.objectPosition = "50% 25%";
        } else {
          // Desktop positioning
          imageRef.current.style.objectPosition = "50% 30%";
        }
      }
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [loading]);

  const handleMediaLoaded = () => {
    setLoading(false);
  };
 
  return (
    <section className="relative z-10 h-full min-h-screen md:pt-44 pt-20 pb-10 md:mt-0">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black z-100">
          <Loader />
        </div>
      )}

      {/* BG IMAGE */}
      {details?.backgroundImage?.url && (
        <Image
          ref={imageRef}
          src={details?.backgroundImage?.url}
          alt={details?.backgroundImage?.alt || "background image"}
          fill
          priority
          sizes="100vw"
          unoptimized
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            display: loading ? "none" : "block",
          }}
          onLoadingComplete={handleMediaLoaded}
        />
      )}

      {/* BG VIDEO */}
      {details?.backgroundVideo?.url && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover object-center z-2 inset-0"
          onCanPlayThrough={handleMediaLoaded}
          style={{ display: loading ? "none" : "block" }}
        >
          <source src={details?.backgroundVideo?.url} type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      <div className="absolute z-3 inset-0 w-full bg-black/70"></div>

      <div className="relative z-50 contain space-y-20 md:gap-0 px-5 mx-auto md:mt-10 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-center w-full">
            <div className="flex flex-col justify-center gap-5 md:gap-10 max-w-[32rem] sm:mr-0">
              <h1 className="font-anton uppercase text-[#F4F2F2] text-4xl font-bold md:text-7xl lg::text-8xl">
                {details?.heroTitle || "WATAWI-MIAMI"}
              </h1>
              <h1 className="mt-[-26px] md:mt-[-40px] font-medium text-[#F4F2F2]">
                {details?.heroTicker}
              </h1>

              <p className="w-full text-[#f4f2f2c8] text-sm md:text-xl">
                {details?.heroSubText}
              </p>
              <div className="mt-[10px] md:mt-[20px]">
                <button
                  id="CTA"
                  className="px-6 py-2 bg-primary text-white rounded-3xl cursor-pointer duration-300 hover:text-white"
                >
                  <Link className="inline-block w-full h-full" href={"/e"}>
                    Explore Events
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>

        <Box className="font-anton w-full grid gap-4 grid-cols-1 md:grid-cols-4 justify-center ">
          <Performance
            count={details?.eventGroup?.count || 10}
            title="Upcoming Events"
            images={details?.eventGroup?.images}
          />
          <Performance
            count={details?.ArtistGroup?.count || 200}
            title="ArtistS Performed"
            images={details?.ArtistGroup?.images}
          />
          <Performance
            count={details?.ticketsGroup?.count || 1000}
            title="TicketS Sold"
            images={details?.ticketsGroup?.images}
          />
        </Box>
      </div>
    </section>
  );
};

export default Hero;
