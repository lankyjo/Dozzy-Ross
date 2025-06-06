import { postFunc } from "@/components/utils/request";
import { Button, Box, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import useSWRMutation from "swr/mutation";

async function sendRequest(url: string, { arg }: { arg: { eventId: string } }) {
  const res = await postFunc({ values: arg, url });
  return res;
}

function downloadCSV({
  csvData,
  eventTitle,
}: {
  csvData: string;
  eventTitle: string;
}) {
  // Create a Blob with the CSV content
  const blob = new Blob([csvData], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  // Create a link to trigger the download
  const link = document.createElement("a");
  link.href = url;
  link.download = `${eventTitle.split(" ").join("_")}.csv`; // File name
  link.click();

  // Clean up
  URL.revokeObjectURL(url);
}

export default function ExportAsCSV({
  event,
  isMenuItem = false,
}: {
  event: SingleEventProps;
  isMenuItem?: boolean;
}) {
  const { trigger, isMutating } = useSWRMutation(
    "ticket/export-attendees-to-csv",
    sendRequest
  );

  const handleClick = async () => {
    try {
      const result = await trigger({ eventId: event?._id });
      downloadCSV({
        csvData: result?.data as string,
        eventTitle: event?.event_title,
      });
    } catch (e: any) {
      showNotification({
        message: e?.response?.data?.message || "Failed to download CSV",
        color: "red",
      });
      console.log("e: ", e);
    }
  };

  // If used inside a MenuItem, render just text and styling
  if (isMenuItem) {
    return (
      <Box
        className="hover:bg-gray-100 px-1 flex items-start justify-start text-primary_color font-poppins-regular"
        style={{ width: "100%" }}
        onClick={handleClick}
      >
        <Text
          className="flex items-center justify-center"
          fw={500}
          fz={{ base: 12, sm: 14 }}
        >
          {isMutating ? "Downloading..." : "Download List"}
        </Text>
      </Box>
    );
  }

  // Otherwise, render as a regular button
  return (
    <Button
      fw={500}
      maw={{ base: 120, sm: "100%" }}
      fz={{ base: 12, sm: 14 }}
      fullWidth
      className="hover:bg-gray-100 px-1 flex items-start justify-start bg-white text-primary_color font-poppins-regular"
      loading={isMutating}
      loaderProps={{
        color: "orange",
      }}
      onClick={handleClick}
    >
      <p className="flex items-center justify-center">Download List</p>
    </Button>
  );
}
