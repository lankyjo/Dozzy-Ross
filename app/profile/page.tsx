"use client";
import TablePagination from "@/components/Pagination/Paginate";
import Ticket from "@/components/Ticket-section/Ticket";
import { imagePlaceholder } from "@/components/utils/contextAPI/helperFunctions";
import useFormatEventData from "@/components/utils/hooks/useFormatEvent";
import useGetter from "@/components/utils/hooks/useGetter";
import { Loader } from "@mantine/core";
import { format } from "date-fns";
import { useState } from "react";
// import { MdSearch } from "react-icons/md";
// import { TextInput } from "@mantine/core";

export default function AllEvent() {
  const [page, setPage] = useState<number>(1);
  // Keeping the state definition but not using setState for now (search functionality commented out)
  const [states] = useState({ query: "" });
  const { data: user } = useGetter("user");

  const {
    data: my_events,
    isLoading,
    error,
  } = useGetter(
    states.query.length > 2 && states?.query && user?.data?._id
      ? `event/search?organizerId=${user?.data?._id}&searchQuery=${states.query}&isMine=true`
      : `event/my-events?page=${page}&size=50`
  );
  const events = useFormatEventData(my_events?.data);

  //const events = useFormatEventData(eventData?.data);

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
    isSoldOut: event.isSoldOut,
    approvalStatus: event?.approvalStatus,
    totalTicketsSold: event?.totalTicketsSold,
  }));

  return (
    <section className="padding md:py-36 py-20 bg-black text-gray-200 space-y-10">
      <div className="space-y-10 contain">
        <div className="text-center">
          <p className="uppercase font-bold text-sm">
            Welcome <span className=" lowercase">{user?.data?.username}</span>
          </p>
          <h3 className="text-4xl font-anton uppercase font-bold">
            countdown to your next event
          </h3>
        </div>
        {/* <div className=" flex  max-w-[900px] mx-auto justify-end ">
          <TextInput
            mt="md"
            rightSectionPointerEvents="none"
            rightSection={<MdSearch />}
            placeholder="Search event"
            className=" justify-self-end w-full md:w-xs"
            styles={{
              input: {
                borderColor: "white",
                color: "white",
              },
            }}
            onChange={(e) => setState({ query: e.target.value })}
          />
        </div> */}

        {isLoading && (
          <div className=" w-full h-full  flex justify-center">
            <Loader color="white" />
          </div>
        )}

        {!isLoading && Tickets.length > 0 && (
          <ul className="space-y-10  ">
            {Tickets.map((ticket) => (
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
                isSoldOut={ticket?.isSoldOut}
                approvalStatus={ticket.approvalStatus}
                isProfile={true}
                totalTicketsSold={ticket?.totalTicketsSold}
                id={ticket.id}
              />
            ))}
          </ul>
        )}

        {!isLoading && !error && Tickets.length < 1 && (
          <div className=" w-full h-full  flex justify-center">
            <h4>Not event found</h4>
          </div>
        )}
      </div>

      {my_events?.data?.meta?.total > 50 && (
        <TablePagination
          lastPage={my_events?.data?.meta?.lastPage ?? 0}
          currentPage={my_events?.data?.meta?.page ?? 0}
          setPage={setPage}
          data={my_events?.data}
        />
      )}
    </section>
  );
}
