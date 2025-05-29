"use client";

import { Dispatch, ReactNode, SetStateAction } from "react";
import { showNotification } from "@mantine/notifications";
import { mutate } from "swr";
import { logoutUser } from "../request";
import Cookies from "js-cookie";
import dayjs from "dayjs";

import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
export const mapImage =
  "https://res.cloudinary.com/isreal/image/upload/v1732348426/Ogaticket/map_oy8erv.png";

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
  color: string = "green",
  icon?: ReactNode
  // naviagate?: () => void
) {
  return showNotification({
    message,
    title,
    color,
    icon,
    position: "top-left",
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
      return [...upcomingEvents, ...additionalEvents].slice(0, 3); // Ensure max 4 events
    }
    return upcomingEvents;
  }

  return filterEvents(allEvents, 0, 3); // If no upcoming events, take first 4 from 'events'
};

type LogoutProps = {
  close: () => void;
  setLoader: Dispatch<SetStateAction<boolean>>;
};

export async function logUserOut({ close, setLoader }: LogoutProps) {
  setLoader(true);

  try {
    await logoutUser();

    // window.location.reload();
  } catch (error) {
    console.error(error);
  } finally {
    Cookies.remove("access_token");

    localStorage.clear();
    sessionStorage.clear();
    mutate(() => true, undefined, { revalidate: false }); // clear all SWR cache

    // Clear cookies (if using cookies for session)
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    close();
    setLoader(false);
  }
}

export function toLower(str: string) {
  return str.toLowerCase();
}
export function startCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const defaultCurrency = "$";
export const defaultNumber = 0;
export const defaultAcceptedCurr = "USD";

export const formatStartDate = (isoDate: any) => {
  const date = new Date(isoDate);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    date.getUTCDay()
  ];

  const month = months[date.getUTCMonth()];

  const day = date.getUTCDate();
  let hour = date.getUTCHours();
  const minute = (date.getUTCMinutes() < 10 ? "0" : "") + date.getUTCMinutes();
  const period = hour < 12 ? "am" : "pm";

  hour = hour % 12 || 12;

  const year = date.getUTCFullYear().toString().slice(-2);

  const formattedDate = `${dayOfWeek}, ${month} ${day}, ${year}: ${hour}:${minute} ${period}`;

  return formattedDate;
};

export function isEmpty(value: unknown): boolean {
  if (value == null) return true; // null or undefined

  if (typeof value === "string") return value.trim().length === 0;

  if (Array.isArray(value)) return value.length === 0;

  if (typeof value === "object") return Object.keys(value).length === 0;

  return false; // numbers, booleans, functions, etc.
}

export function generateUniqueRandomString(): string {
  const generatedStrings = new Set();
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let randomString;

  do {
    randomString = Array.from({ length: 3 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  } while (generatedStrings.has(randomString));

  generatedStrings.add(randomString);
  return randomString;
}

export function isValidDate(dateString: string): boolean {
  dateString = String(dateString).trim();
  const date = new Date(dateString);

  return date instanceof Date && !isNaN(date.getTime());
}

export function newDateFormatter(date: string): string {
  const ty = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formattedDate = dayjs(date).tz(ty).format("MMM D, YYYY : hh:mm A");
  return formattedDate;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const formatTimeDuration = (
  startDate: any | number | Date,
  endDate: any | number | Date
) => {
  // Convert the start and end dates to Date objects
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  // Calculate the difference in milliseconds
  //  " @ts-ignore "
  const durationMs = end - start;

  // Calculate days, hours, and minutes
  const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  // Construct formatted output based on conditions
  if (days > 0) {
    return `${days} days, ${hours} hrs, ${minutes} mins`;
  } else if (hours > 0) {
    return `${hours} hrs, ${minutes} mins`;
  } else {
    return `${minutes} mins`;
  }
};
export function capitalizeNames(names: string): string {
  return names
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
    .join(" ");
}

export const wishlistscreenImage =
  "https://res.cloudinary.com/isreal/image/upload/v1730183480/Ogaticket/ubaid-e-alyafizi-gQhrrWOG60c-unsplash-removebg-preview_pnj96i.png";

export function every<T>(
  collection: T[] | Record<string, T>,
  predicate: (
    value: T,
    key: number | string,
    collection: T[] | Record<string, T>
  ) => boolean
): boolean {
  if (Array.isArray(collection)) {
    for (let i = 0; i < collection.length; i++) {
      if (!predicate(collection[i], i, collection)) {
        return false;
      }
    }
  } else {
    for (const key in collection) {
      if (Object.prototype.hasOwnProperty.call(collection, key)) {
        if (!predicate(collection[key], key, collection)) {
          return false;
        }
      }
    }
  }
  return true;
}

export async function urlToImageFile(
  imageUrl: string,
  fileName = "image"
): Promise<File | null> {
  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    const blob = await response.blob();
    const contentType = blob.type || "image/jpeg";
    const extension = contentType.split("/")[1] || "jpg";

    return new File([blob], `${fileName}.${extension}`, { type: contentType });
  } catch (error) {
    console.error("Error converting image URL to file:", error);
    return null;
  }
}
