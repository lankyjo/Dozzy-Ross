import { Dispatch, Key, SetStateAction } from "react";
import { Modal, Divider, Stack, Text, Box, Image } from "@mantine/core";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { PhotoProvider, PhotoView } from "react-photo-view";
import EventOverviewAttendeeText from "../EventOverviewAttendeeText";
import {
  imagePlaceholder,
  isEmpty,
  isValidDate,
} from "../utils/contextAPI/helperFunctions";

export default function TransactionOverviewModal({
  open,
  close,
  data,
}: {
  open: boolean;
  close: Dispatch<SetStateAction<boolean>>;
  data: any;
}) {
  const router = useRouter();
  const details = [
    { title: "Transaction ID", value: data?.reference },
    {
      title: "Amount",
      value: `${data?.currencySymbol} ${data?.amount?.toLocaleString()}`,
    },
    {
      title: "Date",
      value:
        isValidDate(data?.createdAt) &&
        format(new Date(data?.createdAt), "MMM dd yyyy, hh:mm a"),
    },
  ];

  const inputField = data?.inputField?.map(
    (field: { name: string; value: string }) => ({
      title: field?.name,
      value: field?.value,
    })
  );

  return (
    <Modal
      centered
      title={
        <Text ff="poppins-semibold" fz={20} fw={600}>
          Transaction Details
        </Text>
      }
      withCloseButton
      opened={open}
      onClose={() => close(false)}
      closeButtonProps={{
        size: "lg",
      }}
      transitionProps={{
        duration: 400,
        timingFunction: "ease",
      }}
      overlayProps={{
        blur: 3,
        opacity: 0.5,
        color: "#000",
      }}
      size="lg"
      className="relative">
      <Box className="max-h-[500px] overflow-y-auto ">
        <Stack gap={16}>
          {details?.map((item, index) => (
            <EventOverviewAttendeeText
              key={index}
              label={item.title}
              value={item.value}
              normal={item.title === "Email"}
              isFree={data?.isFree}
            />
          ))}
        </Stack>

        {!isEmpty(inputField) && (
          <>
            <Divider
              my="xs"
              label="Account Details"
              labelPosition="center"
              styles={{
                label: {
                  textTransform: "capitalize",
                  fontSize: 17,
                  fontFamily: "poppins-medium",
                  fontWeight: 500,
                  marginBottom: 24,
                },
              }}
            />
            <Stack gap={16}>
              {data?.withdrawalMethod && (
                <EventOverviewAttendeeText
                  label="Withdrawal Method"
                  value={data?.withdrawalMethod}
                  normal={data?.withdrawalMethod === "Email"}
                  isFree={data?.isFree}
                />
              )}
              {inputField?.map(
                (
                  item: { title: string; value: unknown },
                  index: Key | null | undefined
                ) => (
                  <EventOverviewAttendeeText
                    key={index}
                    label={item.title}
                    value={item.value}
                    normal={
                      item.title === "Email" || item.title === "Your Email"
                    }
                    isFree={data?.isFree}
                  />
                )
              )}
            </Stack>
          </>
        )}

        <Text
          className={`${
            data?.status?.toLowerCase() === "completed"
              ? "text-[#3B822E] mt-4 text-[12px] md:text-[13px] font-poppins-regular bg-[#E9F5EA] rounded-xl p-1 text-center my-2"
              : "text-[#bb4b4b] mt-4 text-[12px] md:text-[13px] font-poppins-regular bg-[#f5e9e9] rounded-xl p-1 text-center my-2"
          }`}>
          {data?.status}
        </Text>
        {data?.status?.toLowerCase() === "rejected" && (
          <Text
            onClick={() =>
              router.push(`/contact-us?eventTitle=${data?.event?.title}`)
            }
            className="capitalize text-[12px] md:text-[13px] text-end w-full border-0 text-secondary_color font-poppins-medium font-medium rounded-md cursor-pointer">
            Contact Admin
          </Text>
        )}

        {!isEmpty(data?.media) && (
          <>
            <Text className="text-[17px] pt-2 font-poppins-semibold text-orange">
              Receipt:
            </Text>
            <PhotoProvider>
              <Box className="overflow-hidden max-h-[200px]">
                <Box className="mx-auto gap-3 mt-0 p-1 flex overflow-x-scroll scrollbar-thumb-gray-300 scrollbar-track-gray-100 bg-background_color">
                  {data?.media?.map(
                    (item: { url: string }, index: Key | null | undefined) => (
                      <Box key={index} className="rounded-md bg-white p-2">
                        <PhotoView src={item?.url || imagePlaceholder}>
                          <Image
                            src={item?.url || imagePlaceholder}
                            alt=""
                            className="rounded-md cursor-pointer"
                            fit="fill"
                            height={120}
                            width={150}
                            style={{
                              objectFit: "cover",
                            }}
                          />
                        </PhotoView>
                      </Box>
                    )
                  )}
                </Box>
              </Box>
            </PhotoProvider>
          </>
        )}

        {data?.note && (
          <Box className="pb-2">
            <Text className="pt-2 text-start text-[17px] font-poppins-semibold text-orange">
              Note:
              <Text className="text-[13px] md:text-[13px] pt-1 font-poppins-regular text-orange">
                {data?.note}
              </Text>
            </Text>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
