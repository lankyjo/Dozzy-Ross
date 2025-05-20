"use client";
import { Box, Container, Flex, Loader } from "@mantine/core";
import React, { useEffect, useState } from "react";
import TicketCategoryCheckout from "../generalEventSinglePageComponents/TicketCategoryCheckout";
import EventEnded from "../generalEventSinglePageComponents/EventEnded";
import EventPhotos from "../generalEventSinglePageComponents/EventPhotos";
import SportsEvent from "../generalEventSinglePageComponents/SportsEvent";
import EventDetailsMobile from "../generalEventSinglePageComponents/EventDetailsMobile";
import NotExistEvent from "../generalEventSinglePageComponents/NotExistEvent";
import GeneralEventToDetails from "../generalEventSinglePageComponents/GeneralEventToDetails";
import useFormatSingleEventData from "@/components/utils/hooks/useSingleEventDataFormat";
import {
  formatStartDate,
  imagePlaceholder,
  isEmpty,
  timeZone,
} from "@/components/utils/contextAPI/helperFunctions";
import DetailsandBlogBanner from "../generalEventSinglePageComponents/DetailsandBlogBanner";
import { useParams } from "next/navigation";
import useGetter from "@/components/utils/hooks/useGetter";

function SingleEventDetails({
  data,
  isLoading,
}: {
  data: SingleEventProps;
  isLoading: boolean;
  error: any;
}) {
  const event = useFormatSingleEventData(data, isLoading);
  const [eventTimeStatus, setEventTimeStatus] = useState<any>(null);
  const isoDateString = new Date(event?.startDate);
  const formattedDate = formatStartDate(isoDateString);

  useEffect(() => {
    const checkEventDateStatus = () => {
      const eventDateObj = new Date(event?.endDate);

      if (isNaN(eventDateObj.getTime())) {
        return;
      }
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

      //  change to  event?.approvalStatus  !== "Approved"
      if (
        new Date(localTimeISO) > new Date(eventDateObj) ||
        event?.approvalStatus?.toLowerCase() !== "approved" ||
        event?.status?.toLowerCase() !== "published" ||
        event?.isSoldOut === true
      ) {
        setEventTimeStatus({
          value: false,
          desc: "Closed",
          comment:
            "Sales of ticket for this event is closed, for more info contact organizer below ",
        });
      } else {
        setEventTimeStatus({
          value: true,
        });
      }
    };
    checkEventDateStatus();
  }, [event?.approvalStatus, event?.endDate, event?.isSoldOut, event?.status]);

  return (
    <main className="w-full  min-h-screen pb-10   overflow-x-hidden bg-white">
      <Container size={2000} px={0} className=" flex w-full min-h-screen">
        <div className="min-h-screen w-full ">
          <Box className="px-2 md:px-[15px] lg:px-[30px] xl:px-[70px] mt-[22px] md:mt-[42px] pb-20 ">
            {isLoading ? (
              <Flex
                h={800}
                w="100%"
                justify="center"
                align="center"
                className="">
                <Loader variant="bars" color="orange.8" />
              </Flex>
            ) : (
              <>
                <DetailsandBlogBanner
                  image={event?.image || imagePlaceholder}
                  isLoading={isLoading}
                />

                {data === undefined || !event?._id ? (
                  <>
                    <NotExistEvent />
                  </>
                ) : (
                  <>
                    <div className=" relative">
                      <GeneralEventToDetails
                        {...event}
                        counter_event_date={formattedDate}
                      />

                      <EventDetailsMobile
                        {...event}
                        counter_event_date={formattedDate}
                      />
                    </div>
                    {eventTimeStatus === null ? null : (
                      <>
                        {eventTimeStatus?.value === true ? (
                          <>
                            {["Sport & Games", "Love & romance"].includes(
                              event?.category?.name
                            ) && <SportsEvent event={event} />}

                            <TicketCategoryCheckout
                              data={data}
                              loading={isLoading}
                            />
                            {!isEmpty(event?.images) && (
                              <EventPhotos images={event?.images || []} />
                            )}
                          </>
                        ) : (
                          <EventEnded
                            title1=" Registration to this event has ended."
                            title2="  You can contact orgainzer with details below."
                            link={`/e/timeline?category=${
                              event?.category?._id
                            }&title=${encodeURIComponent(
                              event?.category?.name || ""
                            )}&page=1&size=20`}
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </Box>
        </div>
      </Container>
    </main>
  );
}

function SingleEventDetailsPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const lowerCaseSlug: string = slug?.toLowerCase() ?? "";
  const { data, isLoading, error } = useGetter(
    `event/single?slug=${lowerCaseSlug}`
  );

  return (
    <div className="min-h-screen w-full ">
      <SingleEventDetails
        data={data?.data}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default SingleEventDetailsPage;
