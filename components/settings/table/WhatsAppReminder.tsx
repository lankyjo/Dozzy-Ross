import { Button } from "@mantine/core";
import React, { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { postFunc } from "@/components/utils/request";

function WhatsAppReminder({ event }: { event: SingleEventProps }) {
  const [spin, setSpin] = useState<boolean>(false);
  const handleSendReminder = async () => {
    if (Number(event?.totalTicketsSold ?? 0) < 1)
      return showNotification({
        message:
          "You currently do not have any attendees to send a whatsApp reminder for this event. ",
        color: "yellow.7",
      });

    setSpin(true);
    try {
      const data = await postFunc({
        values: {
          eventId: event?._id,
        },
        url: "event-notification/send-event-reminder-notification-via-whatsapp",
      });
      if (data?.data?.success) {
        showNotification({
          message: "Reminder sent successfully!",
          color: "green",
        });
      }
    } catch (error: any) {
      showNotification({
        message: error?.response?.data?.message || "Failed to send reminder",
        color: "red",
      });
    } finally {
      setSpin(false);
    }
  };

  return (
    <Button
      className=" hover:bg-gray-100 bg-white  px-1  flex items-start justify-start text-primary_color  font-poppins-regular"
      fw={500}
      fullWidth
      fz={{ base: 12, sm: 14 }}
      loading={spin}
      loaderProps={{
        color: "green",
      }}
      maw={{ base: 120, sm: "100%" }}
      onClick={handleSendReminder}>
      <p className="flex items-center justify-center ">Send Reminder</p>
    </Button>
  );
}

export default WhatsAppReminder;
