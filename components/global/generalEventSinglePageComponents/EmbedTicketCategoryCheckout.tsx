import { ActionIcon, Box, Button, Group, Text } from "@mantine/core";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import AcceptedCurrency from "./AcceptedCurrency";
import ShareandBookmark from "./ShareandBookmark";
import EventDesc from "./EventDesc";

import { useInView } from "react-intersection-observer";
import { getterFetcher } from "@/utils/requests";
import Cookies from "js-cookie";
import ClockIcon from "@/components/icons/ClockIcon";

import { IconMinus, IconPlus } from "@tabler/icons-react";
import IconFailure from "@/components/icons/IconFailure";
import { TempValueContext } from "@/components/utils/contextAPI/TempValueContext";
import useFormatSingleEventData from "@/components/utils/hooks/useSingleEventDataFormat";
import {
  customNotification,
  defaultAcceptedCurr,
  defaultCurrency,
  defaultNumber,
  delay,
  formatTimeDuration,
  isEmpty,
} from "@/components/utils/contextAPI/helperFunctions";
import { useParams, useRouter } from "next/navigation";

function EmbedTicketCategoryCheckout({
  data,
  loading,
}: {
  data: SingleEventProps;
  loading: boolean;
}) {
  const router = useRouter();

  const [, setIsWishlisted] = useState(false);
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const { ref: inViewRef } = useInView();
  const [showInView, setShowInvView] = useState<boolean>(false);
  const token = Cookies.get("access_token");
  const [user, setUser] = useState({} as OrganizerProps);
  const { setVal } = useContext(TempValueContext);

  useEffect(() => {
    async function getUser() {
      try {
        const userData = await getterFetcher("user");
        setUser(userData?.data?.data);
      } catch (error) {
        console.error(error);
      }
    }

    if (token) {
      getUser();
    }
  }, [token]);

  const event = useFormatSingleEventData(data, loading);
  const elementRef = useRef<HTMLDivElement | null>(null); // Type for a div element
  const setRefs = (node: HTMLDivElement | null) => {
    inViewRef(node); // Pass node to the inView ref
    elementRef.current = node; // Assign node to elementRef
  };

  const handleScroll = () => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth" });
    }

    delay(1000);
    setShowInvView(true);
  };

  const ticketCategories = useMemo(() => {
    const eventTicket = event?.ticketGroups
      ?.map((ticket) => ({
        ...ticket,
        units: 0,
        currentAmount: 0,
        totalAmount: 0,
      }))
      .sort((a, b) => a?.amount - b?.amount);
    return eventTicket;
  }, [event]);

  const [reservation, setReservation] = useState<{
    ticket: TicketGroup[];
    currentAmount: number;
    finalTotal: number;
  }>({
    ticket: ticketCategories || [],
    currentAmount: 0,
    finalTotal: 0,
  });

  useEffect(() => {
    setReservation({
      ticket: ticketCategories || [],
      currentAmount: 0,
      finalTotal: 0,
    });
  }, [ticketCategories]);

  const handleEventCartIncrease = ({
    amount,
    id,
  }: {
    amount: number;
    id: string;
  }) => {
    let exactTicket = reservation?.ticket?.find(
      (res: TicketGroup) => res._id === id
    );

    const ticketIndex = reservation?.ticket?.findIndex((res) => res._id === id);
    const qtyPicked =
      exactTicket?.units !== undefined ? Math.round(exactTicket.units - 1) : 0; // o

    if (exactTicket) {
      exactTicket = {
        ...exactTicket,
        units: Math.round(exactTicket?.units + 1) || 0,
        notMoreThanAvailable: qtyPicked < exactTicket.available! ? true : false,
        totalAmount: Math.round((exactTicket?.units + 1) * amount) || 0,
        _id: id,
        amount: Math.round(amount),
      };
      const reserve = reservation.ticket;
      reserve[ticketIndex] = exactTicket;

      setReservation((prev) => ({
        ...prev,
        currentAmount:
          exactTicket?.amount && exactTicket?.units
            ? exactTicket?.amount * exactTicket?.units
            : 0,
        ticket: reserve,
        finalTotal: reserve.reduce((a, b) => a + b.totalAmount, 0),
      }));
    }
  };

  const handleEventCartDecrease = ({
    amount,
    id,
  }: {
    amount: number;
    id: string;
  }) => {
    let exactTicket = reservation?.ticket?.find(
      (res: TicketGroup) => res?._id === id
    );

    const ticketIndex = reservation?.ticket?.findIndex(
      (res) => res?._id === id
    );
    const qtyPicked =
      exactTicket?.units !== undefined ? Math.round(exactTicket.units - 1) : 0; // o

    if (exactTicket) {
      exactTicket = {
        ...exactTicket,
        units: Math.round(exactTicket?.units - 1) || 0,
        notMoreThanAvailable: qtyPicked < exactTicket.available! ? true : false,
        totalAmount: Math.round((exactTicket?.units - 1) * amount) || 0,
        _id: id,
        amount: Math.round(amount),
      };

      const reserve = reservation.ticket;

      reserve[ticketIndex] = exactTicket;

      setReservation((prev) => ({
        ...prev,
        currentAmount:
          exactTicket?.amount && exactTicket?.units
            ? exactTicket?.amount * exactTicket?.units
            : 0,
        ticket: reserve,
        finalTotal: reserve.reduce((a, b) => a + b.totalAmount, 0),
      }));
    }
  };

  const handleReasevationNav = (isWishList: boolean) => {
    setVal({
      ticketCategory: event?.isPaidEvent ? true : false,
      reservation: reservation,
      image: event?.image ?? "",
      event: event,
      isWishlisted: isWishList,
      setIsWishlisted: setIsWishlisted,
      user: user,
    });

    router.push(`/e/embed-checkout`);
  };

  const isoStartDateString = new Date(event?.startDate);
  const isoEndDateString = new Date(event?.endDate);

  const formattedDuration = formatTimeDuration(
    isoStartDateString,
    isoEndDateString
  );

  function hasUnitsGreaterThanOne(array: TicketGroup[]) {
    return array.some((ticket) => Number(ticket.units) > 0);
  }

  return (
    <>
      <Box
        ref={setRefs}
        className="mt-[40px] md:mt-[50px] flex justify-between items-center"
      >
        {["Sport & Games", "Love & romance"].includes(event?.category?.name) ? (
          <div className="mt-[-80px] ">
            <Text className="text-[14px] md:text-[17px] lg:text-[20px] mt-[-4px]  flex justify-normal item-center ">
              {event?.isPrivateEvent ? (
                <Text className="  font-poppins-regular text-secondary_color  rounded-sm text-[12px] md:text-[15px] ">
                  Strickly By Invitation:{" "}
                </Text>
              ) : null}
              {/* "@ts-ignore "*/}
              {event?.ageLimit || event.ageLimit! > 0 ? (
                <Text className=" ml-1 font-poppins-regular  text-secondary_color  rounded-sm text-[12px] md:text-[15px]   ">
                  Age limit {event?.ageLimit}
                  <sup>+</sup>
                </Text>
              ) : null}
            </Text>
          </div>
        ) : null}
        <div className="mt-6 mb-2">
          <Text
            fw={"bolder"}
            className="text-[14px] md:text-[17px] lg:text-[20px] mt-[-4px]   font-poppins-semibold text-text_label"
          >
            {["Sport & Games", "Love & romance"].includes(
              event?.category?.name
            ) ? null : (
              <>Event details </>
            )}
          </Text>
        </div>
        {["Sport & Games", "Love & romance"].includes(
          event?.category?.name
        ) ? null : (
          <div className="mt-4">
            <ShareandBookmark
              qrcode={event?.qrCode}
              shareLink={slug as string}
              title={event.event_title}
              socials={event?.socials}
              event={event}
              size={23}
            />
          </div>
        )}
      </Box>

      {["Sport & Games", "Love & romance"].includes(
        event?.category?.name
      ) ? null : (
        <>
          <hr className="w-full mb-[10px] " />
          <EventDesc description={event?.description || ""} />
          <div className=" mt-2 mb-10">
            <Text className="text-[14px] md:text-[17px] lg:text-[20px] mt-[-4px]  flex justify-normal item-center ">
              {event?.isPrivateEvent ? (
                <Text className="  font-poppins-regular text-secondary_color  rounded-sm text-[12px] md:text-[15px] ">
                  Strictly By Invitation:{" "}
                </Text>
              ) : null}{" "}
              {/* "@ts-ignore "*/}
              {event?.ageLimit || event.ageLimit! > 0 ? (
                <Text className=" ml-1 font-poppins-regular  text-secondary_color  rounded-sm text-[12px] md:text-[15px]   ">
                  Age limit {event?.ageLimit}
                  <sup>+</sup>
                </Text>
              ) : null}
            </Text>
          </div>
        </>
      )}

      <Group className="relative flex flex-col  md:mt-[32px]  justify-start">
        <Text className="mr-auto text-[14px] md:text-[17px] lg:text-[20px] mt-[-4px]    font-poppins-semibold text-text_label">
          Duration
        </Text>
        <Box className=" flex justify-center items-center gap-1 flex-row mr-auto mt-[-10px]">
          <ClockIcon />

          <Text className="text-[14px] md:text-[15px]  lg:text-[17px] font-poppins-regular text-text_label ">
            {formattedDuration}
          </Text>
        </Box>
      </Group>

      <div className="flex mt-4 flex-col md:flex-row justify-between items-center w-full ">
        <Box className="w-full  lg:w-[800px] mt-[0px] md:mt-[20px]">
          <div className="flex flex-row justify-between items-center">
            <div className=" flex flex-col">
              <Text className="text-[14px] md:text-[17px] lg:text-[20px] mt-[20px] md:mb-[10px] font-poppins-semibold space-x-2 text-text_label capitalize ">
                Ticket fee
              </Text>
              {!isEmpty(ticketCategories) && (
                <AcceptedCurrency
                  currency={event?.currency?.name || defaultAcceptedCurr}
                />
              )}
            </div>
            {["Sport & Games", "Love & romance"].includes(
              event?.category?.name
            ) ? (
              <div className="mr-[-15px] mt-6">
                <ShareandBookmark
                  qrcode={event?.qrCode}
                  shareLink={slug as string}
                  title={event.event_title}
                  socials={event?.socials}
                  event={event}
                  // size={23}
                />
              </div>
            ) : null}
          </div>

          <Box className="flex-col mt-[10px] space-y-8">
            {!isEmpty(ticketCategories) &&
              ticketCategories?.map((item: TicketGroup, index) => {
                return (
                  <Box
                    key={index}
                    className="flex  mb-[5px]  border border-gray-300 transition duration-100 rounded-lg hover:border-secondary_color overflow-hidden "
                  >
                    <Box className="flex flex-col justify-between items-start w-full  ">
                      <Box className="  flex justify-between items-center w-full  px-2 py-[2px] border-[0.4px] border-b border-gray-300 bg-[#F3F3F3]   ">
                        <Text className="capitalize font-semibold  text-[14px] lg:text-[17px] text-primary_color_70 font-poppins-medium">
                          {item?.name}
                        </Text>
                        {item?.available > 0 ? (
                          <Box className="flex flex-row space-x-2 justify-between items-center ">
                            <ActionIcon
                              size={35}
                              radius={6}
                              c="white"
                              bg="gray.4"
                              variant="transparent"
                              onClick={() =>
                                item?.units > 0 &&
                                handleEventCartDecrease({
                                  amount: item?.amount,
                                  id: item?._id,
                                })
                              }
                            >
                              <IconMinus size={20} />
                            </ActionIcon>
                            <Text fz={17} p={10}>
                              {item?.units?.toLocaleString()}
                            </Text>

                            {item?.notMoreThanAvailable ?? true ? (
                              <>
                                <ActionIcon
                                  size={35}
                                  radius={6}
                                  c="white"
                                  bg={
                                    item?.units === 5
                                      ? "gray.6"
                                      : "secondary_color.0"
                                  }
                                  variant="transparent"
                                  disabled={
                                    // Number(item?.amount) === 0 &&
                                    // item?.units >= 1
                                    //   ? true
                                    //   :

                                    item?.units === 5 ? true : false
                                  }
                                  onClick={() => {
                                    // console.log(item);

                                    handleEventCartIncrease({
                                      amount: item.amount,
                                      id: item._id,
                                    });
                                  }}
                                >
                                  <IconPlus size={20} />
                                </ActionIcon>
                              </>
                            ) : (
                              <>
                                <ActionIcon
                                  size={35}
                                  radius={6}
                                  bg="gray.6"
                                  variant="transparent"
                                  disabled
                                >
                                  <IconPlus size={20} />
                                </ActionIcon>
                              </>
                            )}
                          </Box>
                        ) : (
                          <Text className="capitalize font-semibold text-[14px] lg:text-[17px] text-secondary_color font-poppins-medium">
                            Sold out
                          </Text>
                        )}
                      </Box>
                      <Box className="flex flex-col  justify-between items-center  px-2  w-full py-2 ">
                        <Text className="text-[17px] md:text-[20px] mr-auto  font-semibold ">
                          {event?.currency?.symbol || defaultCurrency}{" "}
                          {item?.amount?.toLocaleString() || defaultNumber}
                        </Text>
                        {item?.description && (
                          <Text className="flex-wrap text-[14px] md:text-[14px] lg:text-[16px] font-poppins-regular mr-auto text-text_label">
                            {item?.description}
                          </Text>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            {isEmpty(ticketCategories) && (
              <Box className="flex  mb-[5px]  border border-gray-300 transition duration-100 rounded-lg hover:border-secondary_color overflow-hidden ">
                <Box className="flex flex-col justify-between items-start w-full  ">
                  <Box className="  flex justify-between items-center w-full  px-2 py-[2px]       border-[0.4px]      border-b     border-gray-300               bg-[#F3F3F3]   ">
                    <Text className="capitalize font-semibold  text-[14px] lg:text-[17px]         text-primary_color_70 font-poppins-medium">
                      General Access
                    </Text>
                  </Box>
                  <Box className="flex flex-col  justify-between items-center  px-2  w-full pt-2 pb-4">
                    <Text className="text-[14px] md:text-[17px] mr-auto  font-semibold ">
                      Free
                    </Text>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </div>

      {/* bottom action button */}
      <Box className="w-full fixed bottom-0 bg-primary_color_70 z-10 flex flex-col py-4 border-solid border-[.5px]  border-[#567aa7] p-[7px] justify-around items-center left-0">
        <Box>
          {!isEmpty(event?.wishlist) &&
            !isEmpty(ticketCategories) &&
            !showInView && (
              <Text className="md:block  text-center text-[15px] md:text-[20px] font-poppins-regular  text-white">
                Will you be attending?
              </Text>
            )}
          {!isEmpty(event?.wishlist) && !isEmpty(ticketCategories) && (
            <div className="flex flex-row items-center md:w-[400px] justify-center   m-auto gap-4 mt-2  ">
              {!isEmpty(event?.wishlist) &&
                !isEmpty(ticketCategories) &&
                !Boolean(reservation?.finalTotal) &&
                showInView &&
                event?.available && (
                  <Button
                    h={44}
                    variant="white"
                    fullWidth
                    maw={211}
                    onClick={() => handleReasevationNav(true)}
                    className="border-secondary_color  hover:bg-secondary_color hover:text-white rounded-lg text-secondary_color text-[17px] capitalize font-poppins-medium font-medium mx-auto"
                  >
                    Skip
                  </Button>
                )}

              {hasUnitsGreaterThanOne(reservation?.ticket) && (
                <Text className="  text-nowrap text-center text-[25px] lg:text-[32px] font-poppins-semibold  text-white">
                  {event?.currency?.symbol || defaultCurrency}{" "}
                  {reservation?.finalTotal?.toLocaleString() || defaultNumber}
                </Text>
              )}
              {!showInView ? (
                <Button
                  h={44}
                  variant="white"
                  fullWidth
                  maw={211}
                  onClick={handleScroll}
                  className="bg-secondary_color rounded-lg text-white text-[17px] capitalize font-poppins-medium font-medium mx-auto"
                >
                  Yes
                </Button>
              ) : (
                <Button
                  h={44}
                  variant="white"
                  fullWidth
                  maw={211}
                  onClick={() => {
                    if (!hasUnitsGreaterThanOne(reservation?.ticket)) {
                      customNotification(
                        "Alert!",
                        "Please select a ticket",
                        "red.3",
                        <IconFailure />
                      );
                      handleScroll();
                    } else handleReasevationNav(true);
                  }}
                  className="bg-orange-400 rounded-lg text-white text-[17px] capitalize font-poppins-medium font-medium mx-auto"
                >
                  Make Reservation
                </Button>
              )}
            </div>
          )}
          {isEmpty(event?.wishlist) && !isEmpty(ticketCategories) && (
            <div className="flex flex-row items-center md:w-[400px] justify-center   m-auto gap-4 mt-2  ">
              {hasUnitsGreaterThanOne(reservation?.ticket) && (
                <Text className="  text-nowrap text-center text-[25px] lg:text-[32px] font-poppins-semibold  text-white">
                  {event?.currency?.symbol || defaultCurrency}{" "}
                  {reservation?.finalTotal?.toLocaleString() || defaultNumber}
                </Text>
              )}
              <Button
                h={44}
                variant="white"
                fullWidth
                maw={211}
                onClick={() => {
                  if (!hasUnitsGreaterThanOne(reservation?.ticket)) {
                    customNotification(
                      "Alert!",
                      "Please select a ticket",
                      "red.3",
                      <IconFailure />
                    );
                    handleScroll();
                  } else handleReasevationNav(false);
                }}
                className="bg-secondary_color  rounded-lg text-white text-[17px] capitalize font-poppins-medium font-medium mx-auto"
              >
                Buy Ticket
              </Button>
            </div>
          )}
          {isEmpty(event?.wishlist) && isEmpty(ticketCategories) && (
            <div className="flex justify-center   m-auto gap-4 mt-2  ">
              <Text className="  text-center text-[25px] lg:text-[32px] font-poppins-semibold  text-white">
                Free
              </Text>
              <Button
                h={44}
                variant="white"
                fullWidth
                maw={211}
                onClick={() => handleReasevationNav(false)}
                className="bg-orange-400 rounded-lg text-white text-[17px] capitalize font-poppins-medium font-medium mx-auto"
              >
                Make Reservation
              </Button>
            </div>
          )}
          {!isEmpty(event?.wishlist) && isEmpty(ticketCategories) && (
            <div>
              <div className="flex justify-center   m-auto gap-4 mt-2  ">
                <Button
                  h={44}
                  variant="white"
                  fullWidth
                  maw={211}
                  onClick={() => handleReasevationNav(true)}
                  className="bg-orange-400  rounded-lg text-white text-[17px] capitalize font-poppins-medium font-medium mx-auto"
                >
                  Make Reservation
                </Button>
              </div>
            </div>
          )}
        </Box>
      </Box>

      <hr className="w-full mt-[24px]" />
    </>
  );
}

export default EmbedTicketCategoryCheckout;
