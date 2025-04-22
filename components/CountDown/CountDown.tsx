import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { localTimeISO, timeZone } from "../utils/contextAPI/helperFunctions";
import useAppContext from "../utils/hooks/useAppContext";
import Link from "next/link";

const CountDown = () => {
  const { classifyEvents, events } = useAppContext();

  const allEvents =
    classifyEvents?.upcoming?.length > 0 ? classifyEvents?.upcoming : events;

  const count_down = allEvents[0]?.startDate || new Date().toISOString();
  const status = allEvents[0]?.status || "published";
  const startDate = allEvents[0]?.startDate || new Date();
  const endDate = allEvents[0]?.endDate || new Date();
  const slug = allEvents[0]?.slug;

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const leading0 = (num: number) => (num < 10 ? "0" + num : num);

  useEffect(() => {
    const calculateTimeLeft = () => {
      // DEV: EZEUGO
      function getCurrentLocalTimeISO(timeZone: string) {
        const date = new Date();
        const formatter = new Intl.DateTimeFormat("sv-SE", {
          timeZone,
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const formattedDate = formatter.format(date).replace(" ", "T");
        return `${formattedDate}.000`; // Without UTC/Z since it's local time
      }
      const localTimeISO = getCurrentLocalTimeISO(timeZone);
      // DEV: EZEUGO

      const currentTime = new Date(localTimeISO).getTime();
      const targetTime = new Date(count_down).getTime();
      const difference = targetTime - currentTime;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setDays(days);
        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
      } else {
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }
    };
    const intervalId = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [count_down]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="padding text-white py-36"
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(/countdownbg.jpg)`,
      }}
    >
      <div className="contain  flex items-center justify-center">
        <div className="max-w-3xl text-center space-y-10">
          <h3 className="font-anton text-4xl uppercase font-extrabold">
            The Stage Is Set Are You Ready?
          </h3>
          <p>
            {allEvents[0]?.event_title} ticket sale in a few day. Keep your spot
            at the hottest concerts and be part of unforgettable live
            performances. Book your tickets today before they sell out!
          </p>
          {new Date(localTimeISO) < new Date(endDate) ? (
            <>
              <div className="flex max-w-[450px] mx-auto items-center justify-between gap-5">
                <div id="days" className="flex flex-col">
                  <span className="text-3xl font-bold">{leading0(days)}</span>
                  <span>Days</span>
                </div>
                <div id="hours" className="flex flex-col">
                  <span className="text-3xl font-bold">{leading0(hours)}</span>
                  <span>Hours</span>
                </div>
                <div id="minutes" className="flex flex-col">
                  <span className="text-3xl font-bold">
                    {leading0(minutes)}
                  </span>
                  <span>Minutes</span>
                </div>
                <div id="seconds" className="flex flex-col">
                  <span className="text-3xl font-bold">
                    {leading0(seconds)}
                  </span>
                  <span>Seconds</span>
                </div>
              </div>

              <div className="text-black">
                <button className="px-4 py-2 bg-primary rounded-4xl text-white">
                  <Link href={`/e/${slug}`}>Book Ticket</Link>
                </button>
              </div>
            </>
          ) : (
            <span className="text-3xl font-bold">
              {new Date(localTimeISO) > new Date(startDate) &&
              new Date(localTimeISO) < new Date(endDate)
                ? "Event has started"
                : new Date(localTimeISO) > new Date(endDate) ||
                  status !== "published"
                ? "Event has ended"
                : ""}
            </span>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default CountDown;
