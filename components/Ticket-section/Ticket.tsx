"use client";
import Image from "next/image";
import { FaCalendarAlt, FaMap } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
// import { useDisclosure } from "@mantine/hooks";
import { localTimeISO } from "../utils/contextAPI/helperFunctions";
import { useEffect, useState } from "react";
import { IconUser } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useViewportSize } from "@mantine/hooks";
// import EventStateModal from "../modal/EventStateModal";

interface TicketProps {
  imageUrl: string;
  price: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  slug: string;
  startDate: string;
  endDate: string;
  isSoldOut?: boolean;
  approvalStatus?: string;
  isProfile?: boolean;
  totalTicketsSold?: number;
  id?: string;
}

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const Ticket = ({
  imageUrl,
  price,
  title,
  date,
  venue,
  description,
  slug,
  startDate,
  endDate,
  isSoldOut,
  approvalStatus,
  isProfile = false,
  totalTicketsSold,
  id,
}: TicketProps) => {
  const { width } = useViewportSize();
  const [eventOngoing, setEventsOngoing] = useState("");
  const router = useRouter();
  // const [message, setMessage] = useState("");
  // const [opened, { open, close }] = useDisclosure(false);
  useEffect(() => {
    const eventDateObj = new Date(endDate);
    // get time based on time zone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentLocalTimeISO =
      new Date()
        .toLocaleString("sv-SE", { timeZone, hour12: false }) // 24-hour format
        .replace(" ", "T") + ".000Z";
    if (
      new Date(currentLocalTimeISO) > new Date(eventDateObj) &&
      approvalStatus?.toLowerCase() === "approved"
    ) {
      setEventsOngoing("Event Closed");
    } else if (isSoldOut) {
      setEventsOngoing("Event Sold Out");
    } else {
      setEventsOngoing(
        `${
          approvalStatus?.toLowerCase() === "pending"
            ? "Pending"
            : approvalStatus?.toLowerCase() === "rejected"
            ? "Declined"
            : approvalStatus
        }`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleNavigate() {
    // there might be need to include this check
    // const status = eventOngoing?.toLowerCase();

    // if (status === "pending") {
    //   setMessage("This event is currently awaiting approval.");
    //   open();
    //   return;
    // }
    // if (status === "declined") {
    //   setMessage("This event was rejected. Please to contact Ogaticket.");
    //   open();
    //   return;
    // }

    router.push(`/profile/${id}?admin`);
  }

  return (
    <>
      <motion.li
        onClick={() => {
          if (isProfile) {
            handleNavigate();
          }
        }}
        id="tickets"
        variants={itemVariants}
        initial="hidden"
        whileInView="show"
        className={`w-full bg-gray-500/50 py-8 px-6 flex max-sm:flex-col border-1 border-white rounded-2xl gap-10 max-w-[900px] mx-auto ${
          isProfile
            ? "transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:bg-gray-500/70 hover:shadow-xl cursor-pointer"
            : ""
        }`}>
        {/* Image Section */}

        <div className="relative w-full mx-auto flex-1 aspect-video overflow-hidden rounded-2xl max-w-[350px]">
          <Image
            className="absolute inset-0 object-cover"
            fill
            alt={title}
            src={imageUrl}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Ticket Info Section */}
        <div className="flex-1">
          <div className="flex max-sm:flex-col items-center max-sm:items-start justify-between border-b-2 border-white pb-2">
            <h3 className="text-3xl uppercase max-sm:text-xl font-anton font-extrabold">
              {title}
            </h3>
            <p className="flex gap-1 items-baseline">
              <span className="font-bold text-2xl font-anton">{price}</span>
              <span>/</span>
              <span>Ticket</span>
            </p>
          </div>

          {/* Event Details */}
          <div className="pt-3 space-y-3">
            <div className="flex max-sm:flex-col justify-between">
              <div className="flex items-center gap-2">
                <FaCalendarAlt />
                <span>{date}</span>
              </div>
              <div className="flex items-center  gap-2  ">
                <FaMap />
                <span>{width > 500 ? venue : `${venue?.slice(0, 28)}...`}</span>
              </div>
            </div>
            <p>
              {width > 500 ? description : `${description?.slice(0, 30)}...`}
            </p>
            {isProfile ? (
              <div className="flex   justify-between max-sm:text-sm  gap-3 max-sm:justify-between max-sm:gap-0">
                <div className=" flex gap-1 items-center">
                  <IconUser size={20} /> <span>{totalTicketsSold}</span>
                </div>
                <p className="py-2 px-5 capitalize   bg-[gray]  text-white rounded-3xl transition duration-300 hover:text-gray-200">
                  {eventOngoing}
                </p>
              </div>
            ) : (
              <>
                {new Date(localTimeISO) < new Date(endDate) ? (
                  <div className="flex justify-end max-sm:text-sm gap-10 max-sm:justify-between max-sm:gap-0">
                    <button className="py-2 px-5 max-sm:text-[8px] bg-primary text-white rounded-3xl transition duration-300 hover:text-gray-200">
                      <Link href={`/e/${slug}`}>Get Ticket</Link>
                    </button>

                    {/* <button className="shadow shadow-primary bg-transparent rounded-3xl py-2 px-5 max-sm:text-[8px] border border-primary transition duration-300 hover:bg-primary hover:text-white">
    Info Detail
  </button> */}
                  </div>
                ) : (
                  <div className="flex justify-end max-sm:text-sm  max-sm:justify-between max-sm:gap-0">
                    <p className="py-2 px-5   bg-[gray]  text-white rounded-3xl transition duration-300 hover:text-gray-200">
                      {new Date(localTimeISO) > new Date(startDate) &&
                      new Date(localTimeISO) < new Date(endDate)
                        ? "Event has started"
                        : new Date(localTimeISO) > new Date(endDate) ||
                          status !== "published"
                        ? "Event has ended"
                        : ""}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Action Buttons */}
          </div>
        </div>
      </motion.li>
      {/* <EventStateModal message={message} opened={opened} close={close} /> */}
    </>
  );
};

export default Ticket;
