import { Box } from "@mantine/core";
import {
  localTimeISO,
  unavailable,
} from "@/components/utils/contextAPI/helperFunctions";
import { CheckCountDaown, EventCountDawnNewComponent } from "./EventCountdown";
import EventDetails from "./EventDetails";

function GeneralEventToDetails({
  counter_event_date,
  ...event
}: SingleEventProps) {
  return (
    <Box className="hidden md:block">
      <Box className="w-full flex flex-row justify-between items-center py-[10px] border-t border-b">
        <>
          <EventDetails
            {...event}
            counter_event_date={counter_event_date}
            venue={event?.venue || unavailable}
            duration={event?.duration}
          />
          <Box className="flex flex-col items-center ">
            <CheckCountDaown
              startDate={new Date(event?.startDate)}
              endDate={new Date(event?.endDate)}
              status={event?.status || ""}
            />
            {(new Date(localTimeISO) > new Date(event?.startDate) &&
              new Date(localTimeISO) < new Date(event?.endDate)) ||
            new Date(localTimeISO) > new Date(event?.endDate) ||
            event?.status?.toLowerCase() !== "published" ? null : (
              <EventCountDawnNewComponent
                count_down={new Date(event?.startDate)}
              />
            )}
          </Box>
        </>
      </Box>
    </Box>
  );
}

export default GeneralEventToDetails;
