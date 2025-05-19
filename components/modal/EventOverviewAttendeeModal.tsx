import { Dispatch, SetStateAction, useState } from "react";
import {
  Modal,
  Text,
  Box,
  Button,
  Flex,
  Badge,
  CloseButton,
} from "@mantine/core";
import { IconCamera } from "@tabler/icons-react";
import dayjs from "dayjs";
import ScannarModal from "./ScannarModal";
import SearchDialog from "./SearchDialog";
import { postFunc } from "../utils/request";

export default function EventOverviewAttendeeModal({
  open,
  close,
  data,
  refetch,
}: {
  open: boolean;
  close: Dispatch<SetStateAction<boolean>>;
  data: any;
  refetch: string;
}) {
  const [openScanner, closeScanner] = useState(false);
  const [resend, setResend] = useState(false);
  const [showDialogue, setShowDialog] = useState(false);
  const [showEventDialogue, setshowEventDialogue] = useState({
    success: false,
    message: "",
    error: false,
  });

  async function handleResendTicket(ticketId: string) {
    try {
      setResend(true);
      const res: any = await postFunc({
        values: {
          ticketId,
        },
        url: "ticket/resend",
      });

      if (res?.data?.success) {
        setshowEventDialogue({
          error: false,
          success: true,
          message: `A ticket has been sent to ${data?.email?.toLowerCase()}`,
        });
      }
    } catch (error: any) {
      setshowEventDialogue({
        error: true,
        success: false,
        message: error?.response?.data?.message as string,
      });
    } finally {
      setShowDialog(true);
      setResend(false);
    }
  }

  return (
    <Modal
      centered
      withCloseButton={false}
      opened={open}
      onClose={() => close(false)}
      transitionProps={{
        duration: 400,
        timingFunction: "ease",
      }}
      overlayProps={{
        blur: 3,
      }}
      size="lg"
      className="relative bg-black/50 justify-end">
      <Box className="bg-white rounded-t-[20px] max-h-[80%]">
        <Box className="flex flex-row justify-between items-center px-5 border-b border-gray-200">
          <Text className="text-[18px] font-poppins-medium text-[#1F2937]">
            Attendee Details
          </Text>
          <CloseButton onClick={() => close(false)} />
        </Box>

        <Box className="p-5 overflow-y-auto">
          <Box className="flex flex-row justify-between items-center mb-4">
            <Text className="text-[13px] font-poppins-regular text-[#6B7280]">
              Name
            </Text>
            <Text className="text-[13px] font-poppins-regular text-[#1F2937] capitalize">
              {data?.name}
            </Text>
          </Box>
          <Box className="flex flex-row justify-between items-center mb-4">
            <Text className="text-[13px] font-poppins-regular text-[#6B7280]">
              Email
            </Text>
            <Text className="text-[13px] font-poppins-regular text-[#1F2937]">
              {data?.email?.toLowerCase()}
            </Text>
          </Box>
          <Box className="flex flex-row justify-between items-center mb-4">
            <Text className="text-[13px] font-poppins-regular text-[#6B7280]">
              Ticket ID
            </Text>
            <Text className="text-[13px] font-poppins-medium text-orange">
              {data?.code}
            </Text>
          </Box>
          <Box className="flex flex-row justify-between items-center mb-4">
            <Text className="text-[13px] font-poppins-regular text-[#6B7280]">
              Ticket Type
            </Text>
            <Text className="text-[13px] font-poppins-medium text-[#1F2937]">
              {data?.ticketGroup?.name || "Regular"}
            </Text>
          </Box>
          <Box className="flex flex-row justify-between items-center mb-4">
            <Text className="text-[13px] font-poppins-regular text-[#6B7280]">
              Amount
            </Text>
            {data?.coupon ? (
              <Box className="flex flex-row justify-between items-center">
                <Text className="text-[13px] font-poppins-medium text-[#1F2937] line-through">
                  {data?.ticketGroup?.currency?.symbol || " "}{" "}
                  {Number(data?.ticketGroup?.amount)?.toLocaleString() ||
                    "Free"}
                </Text>
                <Text className="text-[10px] ml-2 font-poppins-medium text-[#1F2937] ">
                  {data?.ticketGroup?.currency?.symbol || " "}{" "}
                  {Number(data?.boughtPrice)?.toLocaleString()}
                </Text>
              </Box>
            ) : (
              <Text className="text-[13px] font-poppins-medium text-[#1F2937]">
                {data?.ticketGroup?.currency?.symbol || " "}{" "}
                {data?.ticketGroup?.amount?.toLocaleString() || "Free"}
              </Text>
            )}
          </Box>
          {data?.coupon && (
            <Box className="flex flex-row justify-between items-center mb-4">
              <Text className="text-[13px] font-poppins-regular text-[#6B7280]">
                Coupon Code: {data?.coupon?.code || " "}
              </Text>
              <Text className="text-[13px] font-poppins-medium text-[#1F2937]">
                {data?.coupon?.discount || ""}% discount
              </Text>
            </Box>
          )}

          <Box className="flex flex-row justify-between items-center mb-4">
            <Text className="text-[13px] font-poppins-regular text-[#6B7280]">
              Registration Date
            </Text>
            <Text className="text-[13px] font-poppins-medium text-[#1F2937]">
              {dayjs(data?.createdAt).format("MMM DD YYYY, hh:mm a")} UTC
            </Text>
          </Box>
          <Flex mb={16} justify={"space-between"} gap={20} align={"center"}>
            <Text className="text-[13px] font-poppins-regular text-[#6B7280]">
              Status
            </Text>
            <Badge
              variant="transparent"
              bg={data?.checkedIn ? "green.1" : "red.1"}
              c={data?.checkedIn ? "green.7" : "red.7"}>
              {data?.checkedIn ? "Checked In" : "Not Checked In"}
            </Badge>
          </Flex>
        </Box>

        <Flex align={"center"} gap={10} mt={8} className=" mx-4">
          <Button
            className=" font-poppins-medium rounded-lg"
            onClick={() => handleResendTicket(data?._id)}
            fw={500}
            bg="#171717"
            c="white"
            size="md"
            loading={resend}
            loaderProps={{
              color: "white",
            }}
            fullWidth
            fz={{ base: 12, md: 14 }}>
            Resend Ticket
          </Button>

          <Button
            className=" font-poppins-medium rounded-lg"
            onClick={() => closeScanner(true)}
            fw={500}
            rightSection={<IconCamera size={25} color="#fff" />}
            variant="white"
            size="md"
            bg="#171717"
            c="white"
            fullWidth
            fz={{ base: 12, md: 14 }}>
            Scan Ticket
          </Button>
        </Flex>
      </Box>

      {openScanner && (
        <ScannarModal
          eventId={data?.event || ""}
          openedScanner={openScanner}
          closeScanner={closeScanner}
          refetch={refetch}
          ticketId={data?._id || ""}
          tickets={[data]}
        />
      )}

      {showDialogue && (
        <SearchDialog
          close={setShowDialog}
          opened={showDialogue}
          message={showEventDialogue}
        />
      )}
    </Modal>
  );
}
