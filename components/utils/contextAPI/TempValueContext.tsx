"use client";
import { createContext, JSX, useEffect, useState } from "react";

export const TempValueContext = createContext<TempValueType>(
  {} as TempValueType
);
export default function TempValueProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [organizer, setOrganizer] = useState({} as OrganizerProps);
  const [events, setEvents] = useState([] as EventProps[]);
  const [classifyEvents, setClassyFieldEVents] = useState<{
    upcoming: EventProps[];
    past: EventProps[];
    today: EventProps[];
  }>({
    upcoming: [],
    past: [],
    today: [],
  });
  const [val, setVal] = useState<any>(() => {
    if (typeof window === "undefined") return "";
    try {
      const storedTempValue = localStorage.getItem("val");
      return storedTempValue ? JSON?.parse(storedTempValue) : "";
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return "";
    }
  });

  useEffect(() => {
    if (val !== undefined) {
      localStorage.setItem("val", JSON.stringify(val));
    }
  }, [val]);

  return (
    <TempValueContext.Provider
      value={{
        val,
        setVal,
        organizer,
        setOrganizer,
        events,
        setEvents,
        classifyEvents,
        setClassyFieldEVents,
      }}
    >
      {children}
    </TempValueContext.Provider>
  );
}
