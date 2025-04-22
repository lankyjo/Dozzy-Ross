import React from "react";
import Ticket from "./Ticket";
import Link from "next/link";
import useAppContext from "../utils/hooks/useAppContext";
import { format } from "date-fns";
import {
  getFilteredEvents,
  imagePlaceholder,
} from "../utils/contextAPI/helperFunctions";

const TicketsSection = () => {
  const { classifyEvents, events } = useAppContext();

  const allEvents = getFilteredEvents({
    events,
    upcoming: classifyEvents?.upcoming || [],
  });

  const Tickets = allEvents?.map((event) => ({
    image: event.banner?.url || "/wizkid.webp",
    name: event.event_title,
    price: event?.isPaidEvent
      ? `${event?.currency?.symbol}${event?.minTicket?.price || 0}`
      : "Free",
    date: event?.startDate
      ? format(new Date(event?.startDate), "d MMMM yyyy")
      : "loading...",
    venue:
      event?.venue?.venue && event?.venue?.venue?.length > 35
        ? `${event?.venue?.venue?.slice(0, 35)}...`
        : event?.venue?.venue || "loading...",
    description:
      event?.description && event?.description.length > 120
        ? `${event?.description?.slice(0, 120)}...`
        : event?.description,
    slug: event?.slug,
    id: event?._id,
    startDate: event?.startDate,
    endDate: event?.startDate,
  }));

  return (
    <section className="padding md:py-36 py-20 bg-black text-gray-200 space-y-10">
      <>
        <div className="space-y-10 contain">
          <div className="text-center">
            <p className="uppercase font-bold text-sm">event calendar</p>
            <h3 className="text-4xl font-anton uppercase font-bold">
              countdown your next favorite event
            </h3>
          </div>

          <ul className="space-y-10 ">
            {Tickets.map((ticket) => (
              <Ticket
                key={ticket?.id}
                imageUrl={ticket.image || imagePlaceholder}
                price={ticket.price}
                title={ticket.name}
                description={ticket.description}
                date={ticket.date}
                venue={ticket.venue}
                slug={ticket?.slug}
                endDate={ticket?.endDate}
                startDate={ticket?.startDate}
              />
            ))}
          </ul>

          {
            <div className="w-full text-right max-w-[900px] mx-auto">
              <Link
                href="/e"
                className="cursor-pointer text-primary text-xl underline"
              >
                see more
              </Link>
            </div>
          }
        </div>
      </>
    </section>
  );
};

export default TicketsSection;
