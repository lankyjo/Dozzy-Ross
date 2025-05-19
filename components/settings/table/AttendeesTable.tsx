import { Tabs } from "@mantine/core";
import { useEffect, useState } from "react";
import useGetter from "@/components/utils/hooks/useGetter";
import useFormatSingleEventData from "@/components/utils/hooks/useSingleEventDataFormat";
import AttendeesTab from "../profileTab/AttendeesTab";
import GiftsTab from "../profileTab/GiftsTab";
import CouponTab from "../profileTab/CouponTab";
import { useParams } from "next/navigation";

export default function AttendeesTable({
  setTicketOverview,
}: {
  setTicketOverview: (group: { total: number; _id: string }[]) => void;
}) {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const userRole = "admin";
  const [activeTab, setActiveTab] = useState<string | null>("attendees");

  const { data: eventData, isLoading } = useGetter(
    `event/organizer/single?id=${slug}`
  );
  const eventDetail = useFormatSingleEventData(eventData?.data, isLoading);
  const [eventOngoing, setEventsOngoing] = useState("");

  useEffect(() => {
    const eventDateObj = new Date(eventDetail?.endDate);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentLocalTimeISO =
      new Date()
        .toLocaleString("sv-SE", { timeZone, hour12: false }) // 24-hour format
        .replace(" ", "T") + ".000Z";
    if (new Date(currentLocalTimeISO) > new Date(eventDateObj)) {
      setEventsOngoing("closed");
    } else if (eventDetail?.isSoldOut) {
      setEventsOngoing("full");
    } else {
      setEventsOngoing(
        `${
          eventDetail?.approvalStatus?.toLowerCase() === "pending"
            ? "Awaiting Approval"
            : eventDetail?.approvalStatus?.toLowerCase() === "rejected"
            ? "Rejected by admin"
            : eventDetail?.approvalStatus
        }`
      );
    }
  }, [eventOngoing, eventDetail]);

  return (
    <>
      <Tabs color="orange" value={activeTab} onChange={setActiveTab}>
        <Tabs.List grow>
          <Tabs.Tab
            value="attendees"
            className="capitalize text-text_label font-normal font-poppins-regular  text-[13px] md:text-[15px]">
            Attendees 👫🏽
          </Tabs.Tab>
          <>
            {userRole.toLowerCase() === "admin" && (
              <>
                {eventDetail?.wishlist && eventDetail.wishlist.length > 0 && (
                  <Tabs.Tab
                    value="gifts"
                    className=" capitalize text-text_label font-normal font-poppins-regular  text-[13px] md:text-[15px]">
                    Gifts 🎁
                  </Tabs.Tab>
                )}
                {eventDetail?.ticketGroups &&
                  eventDetail.ticketGroups.length > 0 && (
                    <Tabs.Tab
                      value="coupon"
                      className=" capitalize text-text_label font-normal font-poppins-regular  text-[13px] md:text-[15px]">
                      Coupon 🎟️
                    </Tabs.Tab>
                  )}
              </>
            )}
          </>
        </Tabs.List>
        <Tabs.Panel value="attendees" py={20}>
          <AttendeesTab
            eventDetail={eventDetail}
            setTicketOverview={setTicketOverview}
          />
        </Tabs.Panel>
        <Tabs.Panel value="gifts" py={20}>
          <GiftsTab />
        </Tabs.Panel>
        <Tabs.Panel value="coupon" py={20}>
          <CouponTab eventDetail={eventDetail} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
