"use client";
import Hero from "@/components/Hero/Hero";
import useAppContext from "@/components/utils/hooks/useAppContext";
import useFormatEventData from "@/components/utils/hooks/useFormatEvent";
import useGetter from "@/components/utils/hooks/useGetter";
import { useEffect, useState } from "react";
import Artist from "@/components/Artist/Artist";
import CountDown from "@/components/CountDown/CountDown";
import Footer from "@/components/Footer/Footer";
import Sponsors from "@/components/Sponsors/Sponsors";
import Cookies from "js-cookie";
//import Moments from "@/components/Moments/Moments";
import {
  classifyEvents,
  logUserOut,
} from "@/components/utils/contextAPI/helperFunctions";
import TicketsSection from "@/components/Ticket-section/TicketsSection";
import Moments from "@/components/Moments/Moments";
import ImageCarousel from "@/components/ImageCarousel/ImageCarousel";
import ContactForm from "@/components/ContactForm/ContactForm";
import "react-photo-view/dist/react-photo-view.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const { setEvents, setOrganizer, setClassyFieldEVents } = useAppContext();
  const token = Cookies.get("access_token");
  const [userVariables, setUserVariables] = useState<any>(null);
  const { data: loggedInuser } = useGetter(token ? "user" : null);
  // console.log(loggedInuser, "loggedInuser");
  useEffect(() => {
    const getUserVariables = async () => {
      const res = await fetch("/api/details");
      const variableVals = await res.json();
      setUserVariables(variableVals);
    };

    getUserVariables();
  }, []);

  const { data: eventData } = useGetter(
    `event/user-events/${userVariables?.variables?.userId}`
  );

  const events = useFormatEventData(eventData?.data);
  const { data: user } = useGetter(
    `user/public?usernameSlug=${userVariables?.variables?.userName}`
  );

  useEffect(() => {
    if (events?.length) {
      setEvents(events);
      const classifieldEvents = classifyEvents(events);
      setClassyFieldEVents(classifieldEvents);
    }
    if (user?.data) {
      setOrganizer(user?.data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, user?.data]);

  return (
    <>
      <main className="min-h-[2000px] overflow-x-hidden w-full">
        <Hero />
        <Artist />
        <Moments />
        <TicketsSection />
        <ImageCarousel />
        <Sponsors />
        <CountDown />
        <ContactForm />
        <Footer />
      </main>
    </>
  );
}
