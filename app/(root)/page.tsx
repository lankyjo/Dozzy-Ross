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
import { classifyEvents } from "@/components/utils/contextAPI/helperFunctions";
import TicketsSection from "@/components/Ticket-section/TicketsSection";
import Moments from "@/components/Moments/Moments";
import ImageCarousel from "@/components/ImageCarousel/ImageCarousel";
import ContactForm from "@/components/ContactForm/ContactForm";
import "react-photo-view/dist/react-photo-view.css";
// import AuthChecker from "@/components/utils/AuthChecker";

export default function Home() {
  const { setEvents, setOrganizer, setClassyFieldEVents } = useAppContext();
  const token = Cookies.get("access_token");
  const [userVariables, setUserVariables] = useState<any>(null);

  // Direct check for unauthorized access - no reliance on AuthGuard
  useEffect(() => {
    if (!token) return; // Not logged in, so no need to check

    // Get the user ID and allowed ID
    const userId = localStorage.getItem("user_id");
    const allowedId = localStorage.getItem("allowed_user_id");

    if (userId && allowedId && userId !== allowedId) {
      console.log("DIRECT CHECK: Unauthorized user detected");

      // Show a direct notification
      const notification = document.createElement("div");
      notification.style.position = "fixed";
      notification.style.top = "0";
      notification.style.left = "0";
      notification.style.right = "0";
      notification.style.background = "red";
      notification.style.color = "white";
      notification.style.padding = "15px";
      notification.style.textAlign = "center";
      notification.style.fontWeight = "bold";
      notification.style.zIndex = "99999";
      notification.innerHTML =
        "HOME PAGE: UNAUTHORIZED USER DETECTED - ID MISMATCH";

      document.body.appendChild(notification);

      // Redirect to auth test page
      setTimeout(() => {
        window.location.href = "/auth-test";
      }, 3000);
    }
  }, [token]);

  // Get user variables from API
  useEffect(() => {
    const getUserVariables = async () => {
      const res = await fetch("/api/details");
      const variableVals = await res.json();
      setUserVariables(variableVals);
      // Store the allowed user ID in localStorage for client-side auth checks
      if (variableVals?.variables?.userId) {
        localStorage.setItem("organizer_id", variableVals.variables.userId);
      }
    };

    getUserVariables();
  }, [token]);

  // Only fetch events when userId is available
  const { data: eventData } = useGetter(
    userVariables?.variables?.userId
      ? `event/user-events/${userVariables.variables.userId}`
      : null
  );

  const events = useFormatEventData(eventData?.data);
  const { data: user } = useGetter(
    userVariables?.variables?.userName
      ? `user/public?usernameSlug=${userVariables.variables.userName}`
      : null
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
  );
}
