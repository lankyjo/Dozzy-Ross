import { Box, Button, Modal, Text } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";

import { Scanner } from "@yudiel/react-qr-scanner";
// import { getterFetcher, postFunc } from "@/utils/requests";

import { useViewportSize } from "@mantine/hooks";
import { mutate } from "swr";

import {
  defaultCurrency,
  defaultNumber,
  formatStartDate,
} from "../utils/contextAPI/helperFunctions";
import IconSuccess from "../icons/IconSuccess";
import IconFailure from "../icons/IconFailure";
import { getterFetcher, postFunc } from "../utils/request";

export default function ScannarModal({
  openedScanner,
  closeScanner,
  eventId,

  refetch,
  tickets,
  event,
}: {
  openedScanner: boolean;
  eventId: string;
  refetch: any;
  ticketId?: string;
  tickets?: any;
  event?: SingleEventProps;

  closeScanner: Dispatch<SetStateAction<boolean>>;
}) {
  const [, setDetected] = useState("");
  const [pauseScanner, setPauseScanner] = useState(false);
  const [, setSelectedTicket] = useState({} as PaidTicketProps);
  const { width } = useViewportSize();

  const [status, setStatus] = useState({
    message: "",
    data: {
      name: "",
      category: "",
      code: "",
      email: "",
      isFree: false,
      ticketGroup: {
        name: "",
        amount: "",
        currency: {
          symbol: "",
        },
      },
      coupon: {
        code: "",
        discount: 0,
      },
      boughtPrice: 0,
      updatedAt: "",
    },
    status: "",
  });

  const getAttendeeTicket = async ({
    ticketId,
    error,
  }: {
    ticketId: string;
    error: any;
  }) => {
    try {
      const exactTicket = await getterFetcher(`ticket/my-tickets/${ticketId}`);

      setStatus({
        ...status,
        status: "error",
        message: error?.response?.data?.data?.message,
        data: exactTicket?.data?.data,
      });
    } catch (error: any) {
      setStatus({
        ...status,
        status: "error",
        message: error?.response?.data?.data?.message,
        data: {
          name: "",
          category: "",
          code: "",
          email: "",
          isFree: false,
          ticketGroup: {
            name: "",
            amount: "",
            currency: {
              symbol: "",
            },
          },
          coupon: {
            code: "",
            discount: 0,
          },
          boughtPrice: 0,
          updatedAt: "",
        },
      });
    }
  };

  const onNewScanResult = async (decodedResult: any) => {
    const ticket = tickets?.find(
      (ticket: any) => ticket?.code === decodedResult[0]?.rawValue
    );
    if (ticket) {
      setSelectedTicket(ticket);
    }

    try {
      const res: any = await postFunc({
        url: "ticket/check-in",
        values: {
          eventId: eventId,
          ticketCode: decodedResult[0]?.rawValue,
          ticketId: ticket?._id,
        },
      });

      if (res) {
        setStatus({
          ...status,
          status: "success",
          message: res?.data?.message,
          data: res?.data?.data,
        });
      }

      mutate(refetch);
      mutate(`event/organizer/single?id=${eventId}`);

      setPauseScanner(true);
    } catch (error: any) {
      if (
        error?.response?.data?.data?.message?.toLowerCase()?.trim() ===
        "Ticket already checked in"?.toLowerCase()?.trim()
      ) {
        // this is repeated here because at this point the ticket variable looses its stored data
        const ticket = tickets?.find(
          (ticket: any) => ticket?.code === decodedResult[0]?.rawValue
        );
        await getAttendeeTicket({ ticketId: ticket?._id, error });
        setPauseScanner(true);
        return;
      }
      setPauseScanner(true);
      setStatus({
        ...status,
        status: "error",
        message: error?.response?.data?.data?.message,
        data: {
          name: "",
          category: "",
          code: "",
          email: "",
          isFree: false,
          ticketGroup: {
            name: "",
            amount: "",
            currency: {
              symbol: "",
            },
          },
          coupon: {
            code: "",
            discount: 0,
          },
          boughtPrice: 0,
          updatedAt: "",
        },
      });
    }
  };

  return (
    <>
      <Modal
        opened={openedScanner}
        onClose={() => closeScanner(false)}
        centered
        radius={20}
        transitionProps={{
          duration: 400,
          timingFunction: "ease",
        }}
        overlayProps={{
          blur: 3,
          opacity: 0.8,
          color: "#0B032D",
        }}
        classNames={
          {
            //   body: " p-0 m-0",
          }
        }
        withCloseButton={false}
        className=" ">
        <Box className="bg-slate-800   position-relative  rounded-4xl w-full  ">
          {!["error", "success"].includes(status?.status) && (
            <div className=" absolute   h-[2px]  z-30 bg-white animate-move-up-down"></div>
          )}

          {!pauseScanner ? (
            <div>
              <Scanner
                onScan={(result) => onNewScanResult(result)}
                onError={() => setDetected("error")}
                paused={pauseScanner}
                components={{
                  finder: false,
                  // audio: true,
                }}
                allowMultiple={true}
                scanDelay={5000}
                styles={{
                  container: {
                    // backgroundColor: " transparent",
                    border: "none",
                    padding: "0px",
                    margin: "0px",
                    width: "100%",
                    // height: "200px",
                  },
                  video: {
                    borderRadius: "20px",
                  },
                }}
                classNames={{
                  container: "     w-full h-full rounded-4xl h-full",
                }}>
                {}
              </Scanner>
            </div>
          ) : (
            <Box className="px-4 ">
              <div className="  max-h-[80vh] flex flex-col justify-center items-center ">
                {status?.status === "success" && (
                  <div className="bg-transparent  h-full  rounded-4xl pb-6 ">
                    <div className="h-full">
                      <IconSuccess width={width > 400 ? 100 : 50} />

                      <Text className=" font-poppins-bold  text-center   text-secondary_color">
                        Valid Access
                      </Text>

                      {status?.message && (
                        <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap text-center  text-white">
                          {status?.message}
                        </Text>
                      )}

                      {status?.data?.name && (
                        <div className="grid  grid-cols-2 mt-4">
                          <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                            Name:
                          </Text>
                          <Text className=" capitalize font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                            {status?.data?.name}
                          </Text>
                        </div>
                      )}
                      {status?.data?.email && (
                        <div className="grid  grid-cols-2 mt-1 ">
                          <>
                            <Text className=" font-poppins-regular text-[12px] md:text-[13px]     text-white">
                              Email:
                            </Text>
                            <Text className=" lowercase font-poppins-regular text-[12px] md:text-[13px]   text-white ">
                              {status?.data?.email?.toLowerCase()}
                            </Text>
                          </>
                        </div>
                      )}
                      {status?.data?.ticketGroup?.name && (
                        <div className="grid  grid-cols-2 mt-1 ">
                          <>
                            <Text className=" font-poppins-regular text-[12px] md:text-[13px]     text-white">
                              Category:
                            </Text>
                            <Text className=" font-poppins-regular text-[12px] md:text-[13px]    text-white">
                              {status?.data?.ticketGroup?.name}
                            </Text>
                          </>
                        </div>
                      )}

                      {!status?.data?.isFree && (
                        <div className="grid  grid-cols-2 mt-1 ">
                          <>
                            <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                              Ticket Price:
                            </Text>
                            <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                              {`${
                                status?.data?.ticketGroup?.currency?.symbol ||
                                defaultCurrency
                              } ${
                                status?.data?.ticketGroup?.amount.toLocaleString() ||
                                defaultNumber
                              }`}
                            </Text>
                          </>
                        </div>
                      )}
                      {status?.data?.isFree && (
                        <div className="grid  grid-cols-2 mt-1 ">
                          <>
                            <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                              Ticket Price:
                            </Text>
                            <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                              free
                            </Text>
                          </>
                        </div>
                      )}

                      {status?.data?.coupon && (
                        <>
                          <div className="grid  grid-cols-2 mt-1">
                            <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                              Paid Amount:
                            </Text>
                            <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                              {`${
                                status?.data?.ticketGroup?.currency?.symbol ||
                                defaultCurrency
                              } ${status?.data?.boughtPrice?.toLocaleString()} ~ ${
                                status?.data?.coupon?.discount
                              }% discount`}
                            </Text>
                          </div>
                          <div className="grid  grid-cols-2 mt-1">
                            <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                              Coupon Code:
                            </Text>
                            <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                              {status?.data?.coupon?.code}
                            </Text>
                          </div>
                        </>
                      )}
                      {status?.data?.code && (
                        <div className="grid  grid-cols-2 mt-1 ">
                          <>
                            <Text className=" font-poppins-regular text-[12px] md:text-[13px]     text-white">
                              Ticket ID
                            </Text>
                            <Text className="break-all font-poppins-regular text-[12px] md:text-[13px]     text-white">
                              {status?.data?.code}
                            </Text>
                          </>
                        </div>
                      )}

                      <div className="flex w-full  justify-center mt-2 md:mt-10 md:min-w-[20rem] lg:min-w-[20rem] xl:min-w-[20rem] sm:min-w-[10rem] xs:min-w-[10rem] ">
                        <Button
                          onClick={() => {
                            setPauseScanner(false);
                            setStatus({
                              data: {
                                name: "",
                                category: "",
                                code: "",
                                email: "",
                                isFree: false,
                                ticketGroup: {
                                  name: "",
                                  amount: "",
                                  currency: {
                                    symbol: "",
                                  },
                                },
                                coupon: {
                                  code: "",
                                  discount: 0,
                                },
                                boughtPrice: 0,
                                updatedAt: "",
                              },
                              message: "",
                              status: "",
                            });
                          }}
                          className="  w-full   hover:bg-secondary_color_hover bg-secondary_color rounded-md  text-center text-white  font-poppins-medium text-[12px]">
                          Scan Another
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {status?.status === "error" && (
                  <>
                    <div className="bg-transparent  rounded-4xl pb-6 ">
                      <IconFailure width={100} />

                      <Text className=" font-poppins-bold text-center  text-[red]">
                        Invalid Access
                      </Text>
                      {status?.message && (
                        <Text className=" font-poppins-regular my-4  text-[12px] md:text-[13px]  text-break text-wrap text-center  text-white">
                          {status?.message}
                        </Text>
                      )}

                      {status?.data?.name && (
                        <div className="grid  grid-cols-2 mt-1">
                          <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                            Name:
                          </Text>
                          <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                            {status?.data?.name}
                          </Text>
                        </div>
                      )}
                      {status?.data?.email && (
                        <div className="grid  grid-cols-2 mt-1">
                          <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                            Email:
                          </Text>
                          <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                            {status?.data?.email}
                          </Text>
                        </div>
                      )}
                      {status?.data?.category && (
                        <div className="grid  grid-cols-2 mt-1">
                          <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                            Email:
                          </Text>
                          <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                            {status?.data?.category}
                          </Text>
                        </div>
                      )}

                      {status?.data?.ticketGroup?.name && (
                        <div className="grid  grid-cols-2 mt-1 ">
                          <Text className=" font-poppins-regular text-[12px] md:text-[13px]     text-white">
                            Category:
                          </Text>
                          <Text className=" font-poppins-regular text-[12px] md:text-[13px]    text-white">
                            {status?.data?.ticketGroup?.name}
                          </Text>
                        </div>
                      )}

                      {!event?.isPaidEvent &&
                        status?.message?.toLowerCase()?.trim() ===
                          "Ticket already checked in"
                            ?.toLowerCase()
                            ?.trim() && (
                          <div className="grid  grid-cols-2 mt-1 ">
                            <Text className=" font-poppins-regular text-[12px] md:text-[13px]     text-white">
                              Category:
                            </Text>
                            <Text className=" font-poppins-regular text-[12px] md:text-[13px]    text-white">
                              free
                            </Text>
                          </div>
                        )}
                      {status?.data?.updatedAt && (
                        <div className="grid  grid-cols-2 mt-1">
                          <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                            CheckIn Time:
                          </Text>
                          <Text className=" font-poppins-regular text-[12px] md:text-[13px]  text-break text-wrap   text-white">
                            {formatStartDate(status?.data?.updatedAt)}
                          </Text>
                        </div>
                      )}

                      <div className="flex w-full justify-center  mt-10 md:min-w-[20rem] lg:min-w-[20rem] xl:min-w-[20rem] sm:min-w-[10rem] ">
                        <Button
                          onClick={() => {
                            setPauseScanner(false);
                            setStatus({
                              data: {
                                name: "",
                                category: "",
                                code: "",
                                email: "",
                                isFree: false,
                                ticketGroup: {
                                  name: "",
                                  amount: "",
                                  currency: {
                                    symbol: "",
                                  },
                                },
                                coupon: {
                                  code: "",
                                  discount: 0,
                                },
                                boughtPrice: 0,
                                updatedAt: "",
                              },
                              message: "",
                              status: "",
                            });
                          }}
                          className="  w-full  hover:bg-secondary_color bg-secondary_color rounded-md  text-center text-white  font-poppins-medium text-[12px]">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
}
