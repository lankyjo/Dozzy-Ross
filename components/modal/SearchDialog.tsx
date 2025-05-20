import { Box, Button, Modal, Text } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

import { useViewportSize } from "@mantine/hooks";
import Confetti from "react-confetti";
import IconFailure from "../icons/IconFailure";
import IconSuccess from "../icons/IconSuccess";
import { isEmpty } from "../utils/contextAPI/helperFunctions";
import { useRouter } from "next/navigation";

export default function SearchDialog({
  opened,
  close,
  message,
  isRejected,
  isWithdrawal = "",
  isEdit,
  notEdit,
}: {
  opened: boolean;
  message: {
    success: boolean;
    message: string;
    error: boolean;
    title?: string;
  };
  isRejected?: string;
  isWithdrawal?: string;
  isEdit?: boolean;
  notEdit?: boolean;

  close: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { height, width } = useViewportSize();

  return (
    <>
      {message?.success && <Confetti width={width} height={height} />}s
      <Modal
        opened={opened}
        onClose={() => close(false)}
        withCloseButton={false}
        centered>
        {message?.success ? (
          <Box className="   mt-6 w-full">
            <div className="w-full flex justify-center ">
              <IconSuccess />
            </div>

            <Text className="font-poppins-bold  text-center "> Success</Text>

            <Text className=" text-center  mb-6 mt-3  text-[14px] md:text-[13px] text-[#020c2697] font-poppins-regular md:text-poppins-medium  max-w-[410px] md:max-w-[600px]">
              {message?.message}
            </Text>

            <Button
              onClick={() => {
                if (!isEmpty(isWithdrawal)) {
                  window.location.href = `/${isWithdrawal}`;
                }

                if (isEdit) {
                  router.back();
                }

                if (notEdit) {
                  router.push("/profile");
                }

                close(false);
              }}
              variant="white"
              className="capitalize w-full border-0 text-white bg-secondary_color font-poppins-medium font-medium rounded-md ">
              {!isEmpty(isWithdrawal) ? "Back to Dashboard" : "Okay"}
            </Button>
          </Box>
        ) : (
          <Box className="   mt-6 w-full">
            <div className="w-full flex justify-center ">
              <span className=" text-center   bg-slate-100  p-2 rounded-full">
                <IconFailure />
              </span>
            </div>

            {isRejected === "Rejected by admin" && (
              <Text className="font-poppins-bold  text-center ">Notice</Text>
            )}

            {isRejected === "Awaiting Approval" && (
              <Text className="font-poppins-bold  text-center ">
                Awaiting Approval
              </Text>
            )}

            {!["Rejected by admin", "Awaiting Approval"].includes(
              isRejected || ""
            ) && (
              <Text className="font-poppins-bold  text-center "> Error</Text>
            )}

            <Text className=" text-center  mb-6 mt-3  text-[14px] md:text-[13px] text-[#020c2697] font-poppins-regular md:text-poppins-medium  max-w-[410px] md:max-w-[600px]">
              {message?.message}
            </Text>
            {isRejected === "Rejected by admin" && (
              <Button
                onClick={() =>
                  router.push(`/contact-us?eventTitle=${message?.title}`)
                }
                variant="white"
                className="capitalize w-full border-0 text-white bg-secondary_color font-poppins-medium font-medium rounded-md ">
                Contact Admin
              </Button>
            )}
            {isRejected === "Awaiting Approval" && (
              <Button
                onClick={() => {
                  close(false);
                }}
                variant="white"
                className="capitalize w-full border-0 text-white bg-secondary_color font-poppins-medium font-medium rounded-md ">
                Okay
              </Button>
            )}
            {!["Rejected by admin", "Awaiting Approval"].includes(
              isRejected || ""
            ) && (
              <Button
                onClick={() => close(false)}
                variant="white"
                className="capitalize w-full border-0 text-white bg-secondary_color font-poppins-medium font-medium rounded-md ">
                Try Again
              </Button>
            )}
          </Box>
        )}
      </Modal>
    </>
  );
}
