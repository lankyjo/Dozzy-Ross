import {
  Accordion,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Loader,
  Paper,
  Switch,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Progress,
  Modal,
  Menu,
  ActionIcon,
} from "@mantine/core";
import React, { useEffect, useState } from "react";

import Link from "next/link";

import { mutate } from "swr";

import {
  IconDotsVertical,
  IconDownload,
  IconEdit,
  IconEye,
  IconTicket,
} from "@tabler/icons-react";

import { eventOverviewtab } from "../utils/localData";
import AttendeesTable from "./table/AttendeesTable";
import ScannerTable from "./table/ScannerTable";
import TransactionsTable from "./table/TransactionsTable";
import ArrowDownIcon from "../icons/ArrowDownIcon";
import useGetter from "../utils/hooks/useGetter";
import useFormatSingleEventData from "../utils/hooks/useSingleEventDataFormat";
import {
  customErrorFunc,
  defaultCurrency,
  defaultNumber,
  isEmpty,
} from "../utils/contextAPI/helperFunctions";
import { postFunc } from "../utils/request";
import SearchDialog from "../modal/SearchDialog";
import { inputBorder } from "../global/inputs/LocalTextinput";
import WhatsappIcon from "../icons/WhatsappIcon";
import ExportAsCSV from "./table/ExportAsCSV";
import WhatsAppReminder from "./table/WhatsAppReminder";
import EmbededCode from "./table/EmbededCode";
import { useParams, useRouter } from "next/navigation";

export default function EventOverviewTabs() {
  const [activeTab, setActiveTab] = useState<string | null>("attendee");

  const [message, setMessage] = useState({ subject: "", body: "" });
  const [maxMessageHeader, setMaxMessageHeader] = useState("");
  const [maxMessageBody, setMaxMessageBody] = useState("");
  const [submit, setSubmit] = useState(false);
  const [brodcasterMessage, setbrodcasterMessage] = useState({
    success: false,
    message: "",
    error: false,
  });
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const router = useRouter();
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const user = "admin";
  const [, setChecked] = useState<any>("");
  const { data: boughWishLists } = useGetter(
    `event/bought-wishlists?eventId=${slug}`
  );
  const { data: eventData, isLoading } = useGetter(
    `event/organizer/single?id=${slug}`
  );
  const eventDetail = useFormatSingleEventData(eventData?.data, isLoading);
  const [overview, setTicketOverVview] = useState<
    { total: number; _id: string }[]
  >([]);

  const [value, setValue] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [seeEventSales, setEventSales] = useState(false);
  const [spin, setSpin] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [openSalesModal, setOpenSalesModal] = useState(false);

  async function broadCastMessage(e: React.FormEvent) {
    e.preventDefault();

    if (isEmpty(message.subject)) {
      setMaxMessageHeader("Message header can not be empty");
      return;
    }
    if (isEmpty(message.body)) {
      setMaxMessageBody("Message body can not be empty");
      return;
    }

    if (
      Number(eventDetail?.totalTicketsSold) < 1 &&
      isEmpty(boughWishLists?.data)
    ) {
      setbrodcasterMessage({
        ...brodcasterMessage,
        success: false,
        message: "No audience for this event",
        error: false,
      });
      setOpenSearchDialog(true);
      return;
    }
    try {
      setSubmit(true);
      const data = await postFunc({
        values: {
          eventId: slug,
          subject: message?.subject,
          body: message?.body,
        },
        url: "event/broadcast-email",
      });
      if (data) {
        setMessage({ body: "", subject: "" });
        setSubmit(false);
      }

      setbrodcasterMessage({
        ...brodcasterMessage,
        success: true,
        message: "Broadcast sent successfully",
        error: false,
      });
      setOpenSearchDialog(true);
    } catch (error: any) {
      setbrodcasterMessage({
        ...brodcasterMessage,
        success: false,
        message: error?.response?.data?.message,
        error: true,
      });
      setSubmit(false);

      setOpenSearchDialog(true);
    }
  }

  function countWords(text: string): number {
    if (!text.trim()) return 0;

    return text.trim().split(/\s+/).length;
  }

  useEffect(() => {
    if (eventDetail?.status) {
      setChecked(
        eventDetail?.status?.toLowerCase() === "closed_by_organizer"
          ? false
          : true
      );
    }
  }, [eventDetail?.status]);

  useEffect(() => {
    if (eventDetail?._id) {
      const isAvailable =
        Boolean(eventDetail.totalSalesAmount) ||
        eventDetail.ticketGroups!.length > 0 ||
        eventDetail.wishlist!.length > 0;
      setEventSales(isAvailable);
    }
  }, [setEventSales, seeEventSales, eventDetail]);

  async function handleLiveOff() {
    setSpin(true);
    try {
      const res = await postFunc({
        url: "event/open-close",
        values: {
          eventId: eventDetail?._id,
          type:
            eventDetail?.status?.toLowerCase() === "closed_by_organizer"
              ? "open"
              : "close",
        },
      });
      if (res?.data?.success) {
        mutate(`event/organizer/single?id=${slug}`);
      }
    } catch (error) {
      customErrorFunc(error);
    } finally {
      setSpin(false);
    }
  }

  // ckeck event has ended
  function hasEventEnded() {
    const currentDate = new Date();
    const eventEndDate = new Date(eventDetail?.endDate);

    // Reset time portions to compare just dates
    currentDate.setHours(0, 0, 0, 0);
    eventEndDate.setHours(0, 0, 0, 0);

    // Check if event end date is before current date
    return eventEndDate < currentDate;
  }

  // embed modal
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  return (
    <div className="w-full mt-6">
      {isLoading ? (
        <Flex h={500} justify="center" align="center" mt={30}>
          <Loader size={24} color="white" />
        </Flex>
      ) : (
        <>
          <Tabs color="orange" value={activeTab} onChange={setActiveTab}>
            {user === "admin" && (
              <Tabs.List grow>
                {eventOverviewtab?.map((item: ReasonProps) => (
                  <Tabs.Tab
                    key={item.id}
                    value={item.value}
                    className="capitalize text-text_label font-normal font-poppins-regular text-[13px] md:text-[15px]">
                    {item.label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            )}

            {activeTab === "attendee" && (
              <Tabs.Panel value="attendee">
                {
                  <Box className="flex flex-col items-center justify-between">
                    <Box className="w-full  mb-4 sm:w-full  p-0 ">
                      {user?.toLowerCase() === "admin" && (
                        <Box mt={32}>
                          <>
                            {seeEventSales && (
                              <Text className="text-text_label capitalize text-[13px] md:text-[15px] font-poppins-regular">
                                Available Balance
                              </Text>
                            )}
                          </>

                          <Flex align="center" justify="space-between">
                            {seeEventSales ? (
                              <Flex
                                gap={16}
                                mt={16}
                                className="cursor-pointer "
                                onClick={() => {
                                  if (seeEventSales) {
                                    if (openAccordion) {
                                      setOpenModal(true);
                                    } else {
                                      setOpenAccordion("photos");
                                      setOpenModal(true);
                                    }
                                  }
                                }}>
                                <Text className="font-poppins-semibold text-[30px] mt-[-20px] flex ">
                                  {eventDetail?.currency?.symbol ||
                                    defaultCurrency}
                                  {eventDetail?.availableBalanceAmount
                                    ? Math.round(
                                        eventDetail?.availableBalanceAmount
                                      )?.toLocaleString()
                                    : defaultNumber}
                                </Text>

                                <Text
                                  onClick={() => setOpenModal(true)}
                                  className="transition-all duration-300 mt-[-10px] ml-[-10px] ease-in-out transform group-hover:translate-y-1">
                                  <ArrowDownIcon />
                                </Text>
                              </Flex>
                            ) : (
                              <Box className="flex flex-col items-start justify-start">
                                <Text className="text-text_label capitalize text-[13px] md:text-[15px] font-poppins-regular">
                                  Available Balance
                                </Text>
                                <Text className="font-poppins-semibold text-[30px] ">
                                  {"$"}
                                  {eventDetail?.availableBalanceAmount
                                    ? Math.round(
                                        eventDetail?.availableBalanceAmount
                                      )?.toLocaleString()
                                    : defaultNumber}
                                </Text>
                              </Box>
                            )}
                            {/* j */}
                            <Menu shadow="md" width={300} position="bottom-end">
                              <Menu.Target>
                                <ActionIcon>
                                  <IconDotsVertical size={30} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                {!hasEventEnded() && (
                                  <>
                                    {user === "admin" && (
                                      <Menu.Item
                                        leftSection={<IconEdit size={24} />}
                                        component={Link}
                                        href={`/e/edit?type=${
                                          eventDetail.category.name.split(
                                            /[\s&]+/
                                          )[0]
                                        }&id=${
                                          eventDetail?.category._id
                                        }&title=${
                                          eventDetail?.slug
                                        }&edit=true&eventId=${
                                          eventDetail?._id
                                        }`}
                                        className=" order-2 cursor-pointer no-underline hover:text-text_label capitalize font-poppins-regular text-[13px] md:text-[14px]">
                                        Edit event
                                        <Divider
                                          orientation="vertical"
                                          color="#EF790D"
                                          className=" order-1"
                                          size={"sm"}
                                        />
                                      </Menu.Item>
                                    )}
                                  </>
                                )}

                                <Menu.Item
                                  leftSection={<IconEye size={24} />}
                                  component={Link}
                                  href={`/e/${eventDetail?.slug}`}
                                  className="cursor-pointer border-l-[1px]  hover:text-text_label capitalize font-poppins-regular text-[13px] md:text-[14px]">
                                  see event
                                </Menu.Item>
                                {/* <Menu.Item icon={<IconCode size={24} />}>
                                    <EmbededCode
                                      setEmbedModalOpen={setEmbedModalOpen}
                                      embedModalOpen={embedModalOpen}
                                      slug={eventDetail?.slug}
                                    />
                                  </Menu.Item> */}
                                <Menu.Item leftSection={<WhatsappIcon />}>
                                  <WhatsAppReminder event={eventDetail} />
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconDownload size={24} />}>
                                  <ExportAsCSV event={eventDetail} />
                                </Menu.Item>
                                {/* <>
                                    {user === "admin" && (
                                      <Menu.Item
                                        icon={<IconMoodEdit size={24} />}
                                        component={Link}
                                        href={`/e/edit?type=${
                                          eventDetail.category.name.split(
                                            /[\s&]+/
                                          )[0]
                                        }&id=${eventDetail?.category._id}&title=${
                                          eventDetail?.slug
                                        }&edit=true&clone=true`}
                                        className=" order-2 cursor-pointer no-underline hover:text-text_label capitalize font-poppins-regular text-[13px] md:text-[14px]"
                                      >
                                        Clone Event
                                        <Divider
                                          orientation="vertical"
                                          color="#EF790D"
                                          className=" order-1"
                                          size={"sm"}
                                        />
                                      </Menu.Item>
                                    )}
                                  </> */}

                                <Menu.Item
                                  leftSection={<IconTicket size={24} />}
                                  // color="red"
                                  className="flex items-center justify-between w-full">
                                  <div className="flex items-center justify-between w-full">
                                    <span>
                                      {eventDetail?.status?.toLowerCase() ===
                                      "closed_by_organizer"
                                        ? "Open Event"
                                        : "Close Event"}
                                    </span>
                                    <Box>
                                      {spin ? (
                                        <Paper
                                          radius={20}
                                          withBorder
                                          w={80}
                                          h={30}
                                          className="flex items-center justify-center">
                                          <Loader color="orange" size="sm" />
                                        </Paper>
                                      ) : (
                                        <Switch
                                          color="orange"
                                          size="lg"
                                          onLabel="Live"
                                          offLabel="OFF"
                                          checked={
                                            eventDetail?.status?.toLowerCase() ===
                                            "closed_by_organizer"
                                              ? false
                                              : true
                                          }
                                          onChange={handleLiveOff}
                                        />
                                      )}
                                    </Box>
                                  </div>
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Flex>

                          <Modal
                            opened={openModal}
                            onClose={() => setOpenModal(false)}
                            title="Financial Details"
                            centered>
                            <Accordion
                              variant="separated"
                              style={{
                                padding: 0,
                                margin: 0,
                                border: "none",
                                background: "transparent",
                              }}
                              value={openAccordion}
                              className="border-0 px-0 mx-0 border-none outline-none bg-transparent">
                              <Accordion.Item
                                value="photos"
                                className="border-0 border-none outline-none bg-transparent px-0">
                                <Accordion.Panel
                                  className="mx-0 px-0"
                                  style={{ padding: 0, margin: 0 }}>
                                  <Box>
                                    <Flex justify="space-between" mt={16}>
                                      <Text className="text-grey_80 text-xs md:text-[15px]">
                                        Total:
                                      </Text>
                                      <Text className="text-grey_80 text-xs md:text-[15px]">
                                        {eventDetail?.currency?.symbol ||
                                          defaultCurrency}{" "}
                                        {eventDetail?.totalSalesAmount
                                          ? Math.round(
                                              eventDetail?.totalSalesAmount
                                            )?.toLocaleString()
                                          : defaultNumber}
                                      </Text>
                                    </Flex>
                                    <Divider mt={3} />
                                  </Box>
                                  <Box>
                                    <Box className="flex justify-between mt-4 text-[12px] md:text-[15px]">
                                      <Text className="text-grey_80">
                                        Charges: (
                                        {eventDetail?.appFeePercentage}
                                        %)
                                      </Text>
                                      {Boolean(
                                        eventDetail?.appFeePercentage
                                      ) && (
                                        <Text className="text-grey_80">
                                          {eventDetail?.currency?.symbol ||
                                            defaultCurrency}{" "}
                                          {Math.round(
                                            eventDetail.totalSalesAmount! -
                                              Number(
                                                eventDetail?.availableToWithdrawAmount
                                              )
                                          )?.toLocaleString()}
                                        </Text>
                                      )}
                                    </Box>
                                    <Divider mt={3} />
                                  </Box>
                                  <Box>
                                    <Box className="flex justify-between mt-4 text-[12px] md:text-[15px]">
                                      <Text className="text-grey_80">
                                        Revenue:
                                      </Text>
                                      <Text className="text-grey_80">
                                        {eventDetail?.currency?.symbol ||
                                          defaultCurrency}{" "}
                                        {eventDetail?.availableToWithdrawAmount
                                          ? Math.round(
                                              eventDetail?.availableToWithdrawAmount
                                            )?.toLocaleString()
                                          : defaultNumber}
                                      </Text>
                                    </Box>
                                    <Divider mt={3} />
                                  </Box>
                                  <Box>
                                    <Box className="flex justify-between mt-4 text-[12px] md:text-[15px]">
                                      <Text className="text-grey_80">
                                        Withdrawn:
                                      </Text>
                                      <Text className="text-grey_80">
                                        {eventDetail?.currency?.symbol ||
                                          defaultCurrency}{" "}
                                        {eventDetail?.totalWithdrawnAmount
                                          ? eventDetail?.totalWithdrawnAmount?.toLocaleString()
                                          : defaultNumber}
                                      </Text>
                                    </Box>
                                    <Divider mt={3} />
                                  </Box>
                                  <Box>
                                    <Box className="flex justify-between mt-4 text-[12px] md:text-[15px]">
                                      <Text className="text-grey_80">
                                        Pending Withdrawal:
                                      </Text>
                                      <Text className="text-grey_80">
                                        {eventDetail?.currency?.symbol ||
                                          defaultCurrency}{" "}
                                        {eventDetail?.totalPendingWithdrawalAmount
                                          ? eventDetail?.totalPendingWithdrawalAmount?.toLocaleString()
                                          : defaultNumber}
                                      </Text>
                                    </Box>
                                    <Divider mt={3} />
                                  </Box>
                                </Accordion.Panel>
                              </Accordion.Item>
                            </Accordion>
                          </Modal>
                        </Box>
                      )}

                      <Box className="my-6 cursor-pointer bg-slate-200  p-2 rounded-md position-relative ">
                        <Box
                          onClick={() => {
                            if (value) {
                              setValue(null);
                            } else {
                              setValue("photo");
                            }
                          }}
                          className={`flex justify-between mb-0   text-[13px] md:text-[14px] ${
                            isEmpty(overview) && "mb-4"
                          }`}>
                          <div
                            className="flex items-center gap-2"
                            onClick={() => setOpenSalesModal(true)}>
                            <Text className="text-[#342D50] text-[13px] md:text-[14px]">
                              Registered
                            </Text>
                            {!isEmpty(overview) && (
                              <div className="transition-all duration-300 ease-in-out transform hover:translate-y-1">
                                <ArrowDownIcon />
                              </div>
                            )}
                          </div>
                          <div className=" ">
                            <span className="text-secondary_color ">
                              {eventDetail?.totalTicketsSold
                                ? eventDetail?.totalTicketsSold?.toLocaleString()
                                : defaultNumber}
                            </span>
                          </div>
                        </Box>

                        {!isEmpty(overview) && (
                          <Box className="text-[13px] md:text-[14px] position-relative">
                            <Modal
                              opened={openSalesModal}
                              onClose={() => setOpenSalesModal(false)}
                              title=""
                              centered>
                              <Box>
                                {/* General Progress */}
                                <Box>
                                  <Box className="flex justify-between">
                                    <Text className="text-grey_80 text-[12px] md:text-[14px]">
                                      Registration Progress:
                                    </Text>
                                    <Text className=" text-[12px] md:text-[14px]">
                                      (
                                      {Math.round(
                                        ((eventDetail?.totalTicketsSold ?? 0) /
                                          (eventDetail?.seatCapacity ?? 1)) *
                                          100
                                      )}
                                      %) filled
                                    </Text>
                                  </Box>

                                  <Progress
                                    value={Math.round(
                                      ((eventDetail?.totalTicketsSold ?? 0) /
                                        (eventDetail?.seatCapacity ?? 1)) *
                                        100
                                    )}
                                    color={
                                      Math.round(
                                        ((eventDetail?.totalTicketsSold ?? 0) /
                                          (eventDetail?.seatCapacity ?? 1)) *
                                          100
                                      ) >= 80
                                        ? "green"
                                        : Math.round(
                                            ((eventDetail?.totalTicketsSold ??
                                              0) /
                                              (eventDetail?.seatCapacity ??
                                                1)) *
                                              100
                                          ) >= 50
                                        ? "orange"
                                        : "red"
                                    }
                                    size="sm"
                                    className="mt-1"
                                  />
                                  <Text className="text-grey_80 text-[12px] md:text-[14px] text-center mt-1">
                                    {eventDetail?.totalTicketsSold?.toLocaleString()}{" "}
                                    of{" "}
                                    {eventDetail?.seatCapacity?.toLocaleString()}{" "}
                                    spots filled
                                  </Text>
                                </Box>
                                {eventDetail?.ticketGroups?.map(
                                  (ticket: any, index: number) => {
                                    const salesPercentage = Math.round(
                                      (ticket.sales / ticket.quantity) * 100
                                    );
                                    return (
                                      <Box key={index} className="mt-2">
                                        <Box className="flex justify-between">
                                          <Box className="flex flex-col justify-between">
                                            <Text className="capitalize text-grey_80 py-1 text-[12px] md:text-[14px]">
                                              {ticket?.name?.toLowerCase()}:{" "}
                                            </Text>
                                            <Text className=" text-secondary_color  mt-[-10px] py-1 text-[12px] md:text-[13px]">
                                              {salesPercentage}% filled
                                            </Text>
                                          </Box>

                                          <Text className="text-grey_80 text-[12px] md:text-[14px]">
                                            {ticket?.sales?.toLocaleString()} of{" "}
                                            {ticket?.quantity?.toLocaleString()}
                                          </Text>
                                        </Box>
                                      </Box>
                                    );
                                  }
                                )}
                              </Box>
                            </Modal>
                          </Box>
                        )}

                        <Box className="flex justify-between  my-2 text-[13px] md:text-[14px]">
                          <Text className="   text-[#342D50]">Checked In</Text>
                          <Text className=" text-secondary_color ">
                            {eventDetail?.totalCheckedIn
                              ? eventDetail?.totalCheckedIn?.toLocaleString()
                              : defaultNumber}
                          </Text>
                        </Box>
                        <Box className="flex justify-between  mb-2 text-[13px] md:text-[14px]">
                          <Text className="   text-[#342D50]">Unchecked</Text>
                          <Text className=" text-secondary_color ">
                            {Number(eventDetail?.totalTicketsSold) -
                            Number(eventDetail?.totalCheckedIn)
                              ? (
                                  Number(eventDetail?.totalTicketsSold) -
                                  Number(eventDetail?.totalCheckedIn)
                                )?.toLocaleString()
                              : defaultNumber}
                          </Text>
                        </Box>

                        <Box className="flex flex-row  justify-between  mt-[-5px]  items-center">
                          <Box className="flex-row justify-start items-start  ">
                            {new Date(eventDetail.endDate) < new Date() ? (
                              <Text className="text-[#bb4b4b] text-[13px] md:text-[14px] capitalize font-poppins-regular bg-[#f5e9e9] rounded-xl pr-2 text-center">
                                Event has ended
                              </Text>
                            ) : (
                              <>
                                {eventDetail?.isSoldOut === true ? (
                                  <Text className="text-[12px] capitalize text-orange">
                                    Sold out
                                  </Text>
                                ) : (
                                  <Box className="flex-row justify-center items-center">
                                    <>
                                      {eventDetail?.status !== "Event Ended" ? (
                                        <Text
                                          className={`${
                                            eventDetail?.status?.toLowerCase() ===
                                            "published"
                                              ? "text-[#3B822E]  text-[13px] md:text-[14px]font-poppins-regular bg-[#E9F5EA] rounded-sm px-2 text-center"
                                              : "text-[#bb4b4b] text-[13px] md:text-[14px] font-poppins-regular bg-[#f5e9e9] rounded-sm px-2 text-center"
                                          }`}>
                                          {eventDetail?.status?.toLowerCase() ===
                                          "published"
                                            ? "Event is Live"
                                            : "Closed by organizer"}
                                        </Text>
                                      ) : (
                                        <Text className="text-[#bb4b4b] text-[13px] md:text-[14px] capitalize font-poppins-regular bg-[#f5e9e9] rounded-xl px-2 text-center">
                                          Event has ended
                                        </Text>
                                      )}
                                    </>
                                  </Box>
                                )}
                              </>
                            )}
                          </Box>
                          <Box className="flex items-center justify-center">
                            {user !== "admin" ? (
                              <Text
                                onClick={() =>
                                  router.push(`/e/${eventDetail?.slug}`)
                                }
                                className="  cursor-pointer border-l-[1px]    text-secondary_color  hover:text-text_label capitalize font-poppins-regular text-[13px] md:text-[14px]">
                                see event
                              </Text>
                            ) : (
                              <EmbededCode
                                setEmbedModalOpen={setEmbedModalOpen}
                                embedModalOpen={embedModalOpen}
                                slug={eventDetail?.slug}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                }

                <AttendeesTable setTicketOverview={setTicketOverVview} />
              </Tabs.Panel>
            )}
            {activeTab === "scanner" && (
              <Tabs.Panel value="scanner" py={24}>
                <ScannerTable />
              </Tabs.Panel>
            )}
            {activeTab === "withdraw" && (
              <Tabs.Panel value="withdraw" py={24}>
                {(eventDetail?.ticketGroups?.length ?? 0) > 0 ||
                (eventDetail?.wishlist?.length ?? 0) > 0 ? (
                  <TransactionsTable />
                ) : (
                  <Box className="flex flex-col items-center justify-center p-8 text-center">
                    <Box className="mb-4 bg-slate-200 rounded-full p-2">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 7V13"
                          stroke="#EF790D"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <circle cx="12" cy="16" r="1" fill="#EF790D" />
                      </svg>
                    </Box>
                    <Text className="text-[20px] md:text-[24px] font-poppins-medium text-secondary_color mb-3">
                      free event
                    </Text>
                    <Text className="text-[14px] md:text-[16px] font-poppins-regular text-grey_80">
                      Free events do not have a withdrawal feature.
                    </Text>
                  </Box>
                )}
              </Tabs.Panel>
            )}
            {activeTab === "broadcast" && (
              <Tabs.Panel value="broadcast" py={24}>
                <>
                  <Box className="w-full max-w-2xl mx-auto">
                    <Box mb={25}>
                      <Text fw={600} ff="poppins-semibold" fz={16}>
                        Send a broadcast
                      </Text>
                      <Text fw={400} ff="poppins-regular" fz={14} mb={8}>
                        Send an email broadcast to all your attendees.
                      </Text>
                    </Box>
                    <form className="w-full" onSubmit={broadCastMessage}>
                      <TextInput
                        size="lg"
                        w="100%"
                        value={message.subject}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          if (countWords(newValue) > 100) {
                            setMaxMessageHeader(
                              "Message header should be less than 100 words"
                            );
                          } else {
                            setMaxMessageHeader("");
                            setMessage({ ...message, subject: newValue });
                          }
                        }}
                        placeholder="Message heading"
                        label="Header"
                        error={maxMessageHeader}
                        radius="xs"
                        styles={(theme) => ({
                          label: {
                            color: theme.colors.primary_color[1],
                            fontFamily: "poppins-regular",
                            fontWeight: 400,
                            fontSize: 14,
                          },
                          input: {
                            marginTop: 7,
                            marginBottom: 30,
                            fontFamily: "poppins-regular",
                            fontSize: 14,
                            border: inputBorder.border,
                            borderRadius: inputBorder.borderRadius,
                            "&:focus": {
                              border: inputBorder.border,
                            },
                          },
                        })}
                      />
                      <Textarea
                        w="100%"
                        autosize
                        value={message.body}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          if (countWords(newValue) > 500) {
                            setMaxMessageBody("Maximum 500 words allowed");
                          } else {
                            setMaxMessageBody("");
                            setMessage({ ...message, body: newValue });
                          }
                        }}
                        minRows={6}
                        placeholder="Type your message here..."
                        label="Message"
                        error={maxMessageBody}
                        styles={(theme) => ({
                          label: {
                            color: theme.colors.primary_color[1],
                            fontFamily: "poppins-regular",
                            fontWeight: 400,
                            fontSize: 14,
                          },
                          input: {
                            marginTop: 7,
                            fontFamily: "poppins-regular",
                            fontSize: 14,
                            border: inputBorder.border,
                            borderRadius: inputBorder.borderRadius,
                            "&:focus": {
                              border: inputBorder.border,
                            },
                          },
                        })}
                      />
                      <Text
                        fw={400}
                        ff="poppins-regular"
                        fz={12}
                        mb={24}
                        c="secondary_color.0">
                        N/B: The email broadcast feature is deactivated 36 hours
                        after the end of the event.
                      </Text>
                      <Group justify="right" mt={14}>
                        <Button
                          size="lg"
                          disabled={
                            isEmpty(message.subject) || isEmpty(message.body)
                          }
                          loading={submit}
                          variant=""
                          type="submit"
                          fullWidth
                          maw={250}
                          className="bg-secondary_color text-white capitalize font-poppins-medium font-medium">
                          Send Message
                        </Button>
                      </Group>
                    </form>
                  </Box>
                </>
              </Tabs.Panel>
            )}
          </Tabs>
        </>
      )}

      {openSearchDialog && (
        <SearchDialog
          close={setOpenSearchDialog}
          opened={openSearchDialog}
          message={brodcasterMessage}
        />
      )}
    </div>
  );
}
