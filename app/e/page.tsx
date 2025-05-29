"use client";
import TablePagination from "@/components/Pagination/Paginate";
import Ticket from "@/components/Ticket-section/Ticket";
import { imagePlaceholder } from "@/components/utils/contextAPI/helperFunctions";
import useFormatEventData from "@/components/utils/hooks/useFormatEvent";
import useGetter from "@/components/utils/hooks/useGetter";
import { Loader } from "@mantine/core";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function AllEvent() {
  const [page, setPage] = useState<number>(1);
  const [userVariables, setUserVariables] = useState<any>(null);
  // const token = Cookies.get("access_token");

  useEffect(() => {
    const getUserVariables = async () => {
      const res = await fetch("/api/details");
      const variableVals = await res.json();
      setUserVariables(variableVals);
    };

    getUserVariables();
  }, []);

  const { data: eventData, isLoading } = useGetter(
    userVariables?.variables?.userId
      ? `event/user-events/${userVariables.variables.userId}?size=50&page=${page}`
      : null
  );

  const events = useFormatEventData(eventData?.data);

  const Tickets = events?.map((event) => ({
    image: event.banner?.url || imagePlaceholder,
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
        : event?.venue?.venue,
    description:
      event?.description && event?.description.length > 129
        ? `${event?.description?.slice(0, 120)}...`
        : event?.description,
    slug: event?.slug,
    id: event?._id,
    starDate: event?.startDate,
    endDate: event?.endDate,
  }));

  return (
    <section className="padding md:py-36 py-20 bg-black text-gray-200 space-y-10">
      <div className="space-y-10 contain">
        <div className="text-center">
          <p className="uppercase font-bold text-sm">event calendar</p>
          <h3 className="text-4xl font-anton uppercase font-bold">
            countdown your next favorite event
          </h3>
        </div>

        {isLoading ? (
          <div className=" w-full h-full  flex justify-center">
            <Loader color="white" />
          </div>
        ) : (
          <ul className="space-y-10  ">
            {Tickets?.map((ticket) => (
              <Ticket
                key={ticket.id}
                imageUrl={ticket.image}
                price={ticket.price}
                title={ticket.name}
                description={ticket.description}
                date={ticket.date}
                venue={ticket.venue}
                slug={ticket?.slug}
                startDate={ticket?.starDate}
                endDate={ticket?.endDate}
              />
            ))}
          </ul>
        )}
      </div>

      {eventData?.data?.meta?.total > 50 && (
        <TablePagination
          lastPage={eventData?.data?.meta?.lastPage ?? 0}
          currentPage={eventData?.data?.meta?.page ?? 0}
          setPage={setPage}
          data={eventData?.data}
        />
      )}
    </section>
  );
}
