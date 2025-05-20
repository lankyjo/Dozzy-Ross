import {
  localTimeISO,
  timeZone,
} from "@/components/utils/contextAPI/helperFunctions";
import { Box, Text } from "@mantine/core";
import { useEffect, useState } from "react";

export function EventCountDawnNewComponent({
  count_down,
}: {
  count_down: Date;
}) {
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
    <div className="grid grid-flow-col gap-1 lg:gap-5 text-center auto-cols-max mb-auto">
      <div className="flex bg-[#171717] flex-col justify-center items-center min-w-[43px] py-[2px] md:py-[5px]  md:px-[15px] bg-primary_color text-[#FFF] rounded-md text-neutral-content text-[11px] md:text-[17px]">
        <span className="font-mono text-[20px] md:text-3xl xl:text-5xl">
          <span>{leading0(days)}</span>
        </span>
        days
      </div>
      <div className="flex  flex-col bg-[#171717] justify-center items-center min-w-[43px] py-[2px] md:py-[5px]  md:px-[15px] bg-primary_color text-[#FFF] rounded-md text-neutral-content text-[11px] md:text-[17px]">
        <span className="font-mono text-[20px] md:text-3xl xl:text-5xl">
          <span>{leading0(hours)}</span>
        </span>
        hrs
      </div>
      <div className="flex flex-col bg-[#171717] justify-center items-center min-w-[43px] py-[2px] md:py-[5px]  md:px-[15px] bg-primary_color text-[#FFF] rounded-md text-neutral-content text-[11px] md:text-[17px]">
        <span className="font-mono text-[20px] md:text-3xl xl:text-5xl">
          <span>{leading0(minutes)}</span>
        </span>
        min
      </div>
      <div className="flex flex-col bg-[#171717] justify-center items-center min-w-[43px] py-[2px] md:py-[5px]  md:px-[15px] bg-primary_color text-[#FFF] rounded-md text-neutral-content text-[11px] md:text-[17px]">
        <span className="font-mono text-[20px] md:text-3xl xl:text-5xl">
          <span>{leading0(seconds)}</span>
        </span>
        sec
      </div>
    </div>
  );
}

export function CheckCountDaown({
  startDate,
  endDate,
  status,
}: {
  startDate: Date;
  endDate: Date;
  status: string;
}) {
  return (
    <Box className="ml-[20px]  flex flex-col justify-center items-center">
      <Text
        fw={"bolder"}
        c={"#171717"}
        className="text-nowrap mb-1 mr-6   text-[15px] mt-[-1px]  md:text-[24px] font-poppins-semibold text-primary_color_70">
        {new Date(localTimeISO) > new Date(startDate) &&
        new Date(localTimeISO) < new Date(endDate)
          ? "Event has started"
          : new Date(localTimeISO) > new Date(endDate) || status !== "published"
          ? "Event has ended"
          : "Event Countdown"}
      </Text>
    </Box>
  );
}
