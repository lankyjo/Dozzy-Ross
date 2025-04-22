"use client";
import { useMemo } from "react";
import {
  checkEventType,
  imagePlaceholder,
  unavailable,
} from "../contextAPI/helperFunctions";

export default function useFormatEventData(data: {
  data: EventProps[];
}): EventProps[] {
  const events = useMemo<EventProps[]>(() => {
    if (data?.data && data?.data !== undefined && data?.data?.length > 0) {
      const events = data?.data?.map(
        ({ title, startDate, banner, ...event }: EventProps) => ({
          ...event,
          type: event?.type,
          currency: Array?.isArray(event?.currency)
            ? event?.currency[0]
            : event?.currency,
          event_title: title ? title : unavailable,
          startDate: startDate,

          banner: banner,
          organizer: {
            firstName: `${event?.organizer?.firstName || unavailable} `,
            lastName: `${event?.organizer?.lastName || unavailable}`,
            isVerified: event?.organizer?.isVerifiedOrganizer,
            username: event?.organizer?.username || unavailable,
            email: event?.organizer?.email || unavailable,
          },
          date: startDate,

          image: banner?.url || imagePlaceholder,
          venue: checkEventType(event.eventLocationType, {
            primaryVenue: {
              address: event.primaryVenue?.address,
              city: event.primaryVenue?.city,
              state: event.primaryVenue?.state,
              country: event.primaryVenue?.country,
            },
            onlineVenue: {
              platform: event?.onlineVenue?.platform,
              url: event?.onlineVenue?.url,
              additionalInfo: event?.onlineVenue?.additionalInfo,
            },
          }),
        })
      );

      return events.filter(
        (event: EventProps) => !event.isSoldOut && !event.isDeleted
      );

      // will add this filet soon
      // .filter((event: EventProp) => {
      //   if (
      //     event?.type?.toLowerCase() === "tour" &&
      //     event?.toLocations?.length > 0
      //   ) {
      //     return event;
      //   }
      //   if (
      //     event?.type?.toLowerCase() === "standard" ||
      //     event?.type?.toLowerCase() === ""
      //   ) {
      //     return event;
      //   }
      // });
    } else {
      return [];
    }
  }, [data]);
  return events;
}
