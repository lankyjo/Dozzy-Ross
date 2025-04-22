import { ReactNode } from "react";
import { notifications } from "@mantine/notifications";

export function checkEventType(
  eventType: string,
  venue: {
    onlineVenue: { platform?: string; url?: string; additionalInfo?: string };
    primaryVenue: {
      address?: string;
      city?: string;
      state?: string;
      country?: string;
    };
  }
): { venue: string; link: string } {
  switch (eventType?.toLowerCase()) {
    case "physical":
      return {
        venue: `${
          venue.primaryVenue.address ? venue.primaryVenue.address : ""
        } ${venue.primaryVenue.city ? venue.primaryVenue.city : ""}, ${
          venue.primaryVenue.state ? venue.primaryVenue.state : ""
        }, ${venue.primaryVenue.country ? venue.primaryVenue.country : ""}`,
        link: "",
      };
    case "online":
      return {
        venue: `Online via ${
          venue.onlineVenue.platform ? venue.onlineVenue.platform : ""
        }`,
        link: `${venue.onlineVenue.url ? venue.onlineVenue.url : ""}`,
      };
    case "hybrid":
      return {
        venue: ` ${venue.primaryVenue.state ? venue.primaryVenue.state : ""}, ${
          venue.primaryVenue.country ? venue.primaryVenue.country : ""
        } & Online`,
        link: "",
      };

    default:
      return {
        venue: `No location info`,
        link: "",
      };
  }
}

export const imagePlaceholder =
  "https://res.cloudinary.com/isreal/image/upload/v1715899457/comedy_slide_ycjs84.jpg";

export const unavailable = "";

export const classifyEvents = (events: EventProps[]) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentLocalTimeISO =
    new Date()
      .toLocaleString("sv-SE", { timeZone, hour12: false }) // 24-hour format
      .replace(" ", "T") + ".000Z";
  const now = new Date(currentLocalTimeISO); // current date and time
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  ); // midnight today
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  ); // end of today

  const classifiedEvents: {
    upcoming: EventProps[];
    past: EventProps[];
    today: EventProps[];
  } = {
    upcoming: [],
    past: [],
    today: [],
  };

  events?.forEach((event) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    // Event is past if its end date is before today
    if (endDate < startOfToday) {
      classifiedEvents.past.push(event);
    }
    // Event is today if it started and has not yet ended
    else if (startDate <= endOfToday && endDate >= startOfToday) {
      classifiedEvents.today.push(event);
    }
    // Event is upcoming if it hasn't started yet
    else if (startDate > endOfToday) {
      classifiedEvents.upcoming.push(event);
    }
  });

  return classifiedEvents;
};
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
export const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
export const localTimeISO = getCurrentLocalTimeISO(timeZone);

export function customNotification(
  title: string,
  message: string,
  color: string,
  icon?: ReactNode
  // naviagate?: () => void
) {
  return notifications.show({
    title,
    message,
    color,
    icon: icon,
    autoClose: 3000,
    styles: () => ({
      title: {
        fontSize: 20,
        textTransform: "capitalize",
        fontFamily: "poppins-bold",
      },
    }),
  });
}

export function customErrorFunc(error: any, icon?: ReactNode) {
  console.error(error);
  if (!error?.response) customNotification("error", error.message, "red", icon);
  else customNotification("error", error?.response.data.message, "red", icon);
}

export const getFilteredEvents = ({
  events,
  upcoming,
}: {
  events: EventProps[];
  upcoming: EventProps[];
}) => {
  const upcomingEvents = upcoming || [];
  const allEvents = events || [];

  // Function to slice events properly
  const filterEvents = (
    eventList: EventProps[],
    start: number,
    end: number
  ) => {
    return eventList.slice(start, end);
  };

  if (upcomingEvents.length >= 4) {
    return filterEvents(upcomingEvents, 1, 5);
  } else if (upcomingEvents.length > 0) {
    if (upcomingEvents.length === 1) {
      // If only one upcoming event, take more from 'events'
      const additionalEvents = filterEvents(allEvents, 1, 4); // Take up to 3 more
      return [...upcomingEvents, ...additionalEvents].slice(0, 4); // Ensure max 4 events
    }
    return upcomingEvents;
  }

  return filterEvents(allEvents, 0, 4); // If no upcoming events, take first 4 from 'events'
};
