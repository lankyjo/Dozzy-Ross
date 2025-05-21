import ArrowDownIcon from "@/components/icons/ArrowDownIcon";
import GoodCheckIcon from "@/components/icons/GoodCheckIcon";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import {
  BackgroundImage,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  // Image,
  Loader,
  Radio,
  Stack,
  Text,
} from "@mantine/core";
import { Dispatch, SetStateAction, useState, useMemo, useEffect } from "react";
import useSWRMutation from "swr/mutation";
import Cookies from "js-cookie";
import Image from "next/image";
import { postFunc } from "@/components/utils/request";
import useGetter from "@/components/utils/hooks/useGetter";
import { useDebounce } from "@/components/utils/hooks/useDebounce";
import {
  capitalizeNames,
  customErrorFunc,
  defaultCurrency,
  defaultNumber,
  every,
  imagePlaceholder,
  isEmpty,
} from "@/components/utils/contextAPI/helperFunctions";
import { paymentLogo } from "@/constaant";

type TicketCheckoutProps = {
  total: number;
  submit?: boolean;
  user?: OrganizerProps;
  wishList?: WishList[];
  // close: Dispatch<SetStateAction<boolean>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedImageId?: number;
  checkoutDetails: {
    selectedImageId?: number;
    name: string;
    email: string;
    paymentservice: string;
    cEmail: string;
    paymentGateWay: string;
    coupon: string;
    phone: string;
  };
  isPhone: boolean;
  setIsPhone: Dispatch<SetStateAction<boolean>>;
  setChechoutDetails: Dispatch<SetStateAction<any>>;
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
  ticketPayedFor: TicketGroup[];
  ticketCategory: boolean;
  reservation?: {
    ticket: TicketGroup[];
    currentAmount: number;
    finalTotal: number;
  };
  image?: string;
  event?: SingleEventProps;
  isVerify: boolean;
  setIsVerify: Dispatch<SetStateAction<boolean>>;
};
type ResTypeEnums = "valid" | "invalid" | "empty" | "loading";
type ArgProps = {
  code: string;
  eventId: string;
  ticketGroupIds: string[];
};

async function sendRequest(url: string, { arg }: { arg: ArgProps }) {
  const res = await postFunc<ArgProps>({ values: arg, url });
  return res;
}

export default function TicketCheckout({
  ticketCategory,
  reservation,
  image,
  event,
  submit,
  handleSubmit,
  handleInput,
  checkoutDetails,
  setChechoutDetails,
  isPhone,
  setIsPhone,
  checked,

  ticketPayedFor,
  user,
  total,
  wishList,
  setIsVerify,
}: TicketCheckoutProps) {
  const token = Cookies.get("access_token");
  const [isEmailConfirmed, setIsEmailConfrirmed] = useState<boolean>(false);
  const [openSummary, setOpenSummary] = useState<boolean>(false);
  const [couponAlert, setCouponAlert] = useState<string>("");
  const [resType, setResType] = useState<ResTypeEnums>("empty");
  const [pickedTickets, setPickedTickets] = useState<string[]>([]);
  const [couponValue, setcouponValue] = useState("");

  const {
    trigger,
    isMutating,
    data: couponData,
    error: couponError,
  } = useSWRMutation("coupon/get-single", sendRequest);
  const { data: paymentSettings } = useGetter("settings");

  let currencyId = "";
  let currencysymbol = "";
  if (event?.currency?._id) {
    currencyId = event.currency._id;
    currencysymbol = event.currency.symbol;
  } else if (event?.minTicket?.currency?._id) {
    currencyId = event.minTicket.currency._id;
    currencysymbol = event.minTicket.currency.symbol;
  } else if (
    Array.isArray(event?.wishlist) &&
    event.wishlist.length > 0 &&
    event.wishlist[0]?.currency?._id
  ) {
    currencyId = event.wishlist[0].currency._id;
    currencysymbol = event.wishlist[0].currency.symbol;
  } else if (
    Array.isArray(event?.ticketGroups) &&
    event.ticketGroups.length > 0 &&
    event.ticketGroups[0]?.currency?._id
  ) {
    currencyId = event.ticketGroups[0]?.currency?._id;
    currencysymbol = event.ticketGroups[0]?.currency?.symbol;
  }
  const { data, isLoading } = useGetter(`payment?currencyId=${currencyId}`);
  const debouncedValue = useDebounce(checkoutDetails.coupon, 500);

  useEffect(() => {
    setcouponValue(() => debouncedValue?.toUpperCase()?.trim());
    async function checkCoupon() {
      try {
        await trigger({
          code: debouncedValue?.toUpperCase()?.trim(),
          eventId: event?._id as string,
          ticketGroupIds: pickedTickets,
        });
      } catch (e: any) {
        customErrorFunc(e);
      }
    }
    if (debouncedValue) checkCoupon();
  }, [debouncedValue, event?._id, pickedTickets, trigger]);

  useEffect(() => {
    if (couponData?.data?.success && couponValue) {
      if (
        couponData?.data?.data?.isActive &&
        !couponData?.data?.data?.isDeleted
      ) {
        if (
          couponData?.data?.data?.totalUsed <
          couponData?.data?.data?.totalAvailable
        ) {
          setResType("valid");
          setCouponAlert(
            couponData?.data?.data?.description || "Coupon code is valid"
          );
          setIsVerify(true);
        } else {
          setResType("invalid");
          setCouponAlert("Coupon code limit has been exhausted");
        }
      } else {
        setResType("invalid");
        setCouponAlert("Coupon code is invalid");
      }
    }

    if (couponError && couponValue) {
      setCouponAlert(
        couponError?.response?.data?.data?.message || "Coupon not found"
      );
      setResType("invalid");
    }
  }, [couponData, resType, couponAlert, couponError, couponValue, setIsVerify]);

  const selectedPaymentMethod = useMemo(() => {
    if (!isEmpty(checkoutDetails.paymentservice)) {
      const paymentGateWay = data?.data?.find(
        (method: any) =>
          method?.name?.toLowerCase() ===
          checkoutDetails?.paymentservice?.toLowerCase()
      );
      return paymentGateWay;
    } else {
      return {};
    }
  }, [checkoutDetails, data]);

  const finalTotalFee = useMemo(() => {
    const totalAmount = total;

    if (
      !isEmpty(reservation) ||
      Boolean(selectedPaymentMethod?.fee) ||
      !isEmpty(wishList)
    ) {
      // do all transactions calculation here
      const appPlatformFee =
        event?.feePayer?.toLowerCase() === "user"
          ? Math.min(
              event?.currency?.platformFeeCap ?? 0,
              ((event?.appFeePercentage ?? 0) / 100) * totalAmount
            )
          : 0;
      const totalAmountToPay = appPlatformFee + totalAmount;
      const paymentmethodFeePercentage =
        paymentSettings?.data?.paymentProcessors[selectedPaymentMethod?.name]
          ?.feePercentage;

      const ticketCurrency = event?.currency?.name;
      const fixedAmount =
        paymentSettings?.data?.paymentProcessors[
          selectedPaymentMethod?.name
        ]?.fixedFeeAmounts?.find(
          (item: { currency: string }) => item.currency == ticketCurrency
        )?.amount ??
        paymentSettings?.data?.paymentProcessors[selectedPaymentMethod?.name]
          ?.fixedBaseFeeAmount;
      const processorFeeRate = paymentmethodFeePercentage / 100;
      const finalAmount =
        (totalAmountToPay + fixedAmount) / (1 - processorFeeRate);

      return {
        // total: finalAmount || totalAmount,
        total: totalAmount,
        processingFee: finalAmount - totalAmountToPay,
        platformFee: appPlatformFee,
      };
    } else {
      return { total: Number(totalAmount), processingFee: 0, platformFee: 0 };
    }
  }, [
    total,
    reservation,
    selectedPaymentMethod,
    wishList,
    event,
    paymentSettings,
  ]);

  useEffect(() => {
    if (!isEmpty(user)) {
      setChechoutDetails({
        paymentservice: "",

        paymentGateWay: "",
        name: !isEmpty(user?.firstName)
          ? capitalizeNames(user?.firstName || "")
          : !isEmpty(user?.lastName)
          ? capitalizeNames(user?.lastName || "")
          : user?.username,
        email: !isEmpty(user?.email) ? user?.email?.toLocaleLowerCase() : "",
      });
    } else {
      if (checkoutDetails.email !== checkoutDetails.cEmail) {
        setIsEmailConfrirmed(true);
      } else {
        setIsEmailConfrirmed(false);
      }
    }
  }, [
    user,
    checkoutDetails?.cEmail,
    checkoutDetails?.email,
    setChechoutDetails,
  ]);

  function areFieldsNotEmptyAndBooleanTrue(obj: {
    name: string;
    email: string;
    paymentservice: string;
    checked: boolean;
    isEmailConfirmed: boolean;
  }) {
    return every(obj, (value) => {
      if (typeof value === "boolean") {
        return value === true;
      }
      return !isEmpty(value);
    });
  }

  useEffect(() => {
    if (!checkoutDetails?.coupon) {
      setResType("empty");
    }
  }, [checkoutDetails?.coupon]);

  useEffect(() => {
    setPickedTickets(ticketPayedFor.map((ticket: TicketGroup) => ticket?._id));
  }, [ticketPayedFor]);

  useEffect(() => {
    if (token) {
      if (user?.phone) {
        setIsPhone(false);
      } else {
        setIsPhone(true);
      }
    } else {
      setIsPhone(true);
    }
  }, [setIsPhone, token, user]);

  useEffect(() => {
    // select the first_payment_option as default
    if (data?.data?.length > 0) {
      const pickedImageId = paymentLogo.find(
        (image: any) => image.name === data.data[0].name
      );
      setChechoutDetails((checkoutDetails: any) => ({
        ...checkoutDetails,
        paymentservice: data?.data[0]?.name,
        paymentGateWay: data?.data[0]?._id || "",
        selectedImageId: pickedImageId?.id,
      }));
    }
  }, [data, setChechoutDetails]);

  return (
    <div className="w-full flex flex-col md:flex-row md:gap-4 md:p-[5px]  h-full   justify-center  mt-[50px] md:mt-[100px]">
      <div className="w-full   md:w-[50%] md:max-w-[451px] order-2 md:order-1">
        <form className="w-full " onSubmit={handleSubmit}>
          <Stack gap={15}>
            <Text
              c={"white"}
              fw={"bold"}
              className=" text-text_label mt-3 md:mt-0 font-normal font-poppins-medium text-base ">
              Enter details below
            </Text>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                required
                readOnly={!isEmpty(user)}
                value={checkoutDetails?.name}
                type="text"
                name="name"
                onChange={handleInput}
                placeholder="Enter FullName"
                className="w-full border-[1px] font-poppins-regular border-grey_70 rounded-lg focus-within:border-grey_70 h-12 p-2.5 outline-none text-sm text-white"
                style={{ fontSize: "16px" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-white">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                onChange={handleInput}
                placeholder="Enter Email"
                readOnly={!isEmpty(user)}
                required
                value={checkoutDetails?.email}
                className="w-full border-[1px] font-poppins-regular border-grey_70 rounded-lg focus-within:border-grey_70 h-12 p-2.5 outline-none text-sm text-white"
                style={{ fontSize: "16px" }}
              />
            </div>

            {isEmpty(user) && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-white">
                    Confirm Email
                  </label>
                  <input
                    type="email"
                    name="cEmail"
                    onChange={handleInput}
                    placeholder="Confirm email"
                    readOnly={!isEmpty(user)}
                    required
                    value={checkoutDetails?.cEmail}
                    className="w-full border-[1px] font-poppins-regular border-grey_70 rounded-lg focus-within:border-grey_70 h-12 p-2.5 outline-none text-sm text-white"
                    style={{ fontSize: "16px" }}
                  />
                </div>
                <span
                  className={`text-red-500 text-xs  ${
                    isEmailConfirmed && isEmpty(user) ? "flex" : "hidden"
                  }`}>
                  Email must match
                </span>
              </>
            )}

            <>
              {event?.isPaidEvent && (
                <Box>
                  <Flex align="center">
                    <Box className=" relative w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-white">
                        Coupon Code
                      </label>
                      <input
                        type="text"
                        name="coupon"
                        onChange={handleInput}
                        placeholder="Enter coupon code (optional)"
                        value={checkoutDetails?.coupon}
                        className="w-full border-[1px] font-poppins-regular border-grey_70 rounded-lg focus-within:border-grey_70 h-12 p-2.5 pr-8 outline-none text-sm text-white"
                        style={{ fontSize: "16px" }}
                      />
                      <span className=" absolute   transform translate-x-[50%] translate-y-[50%] right-4">
                        {isMutating && <Loader size={20} color="#EF790D" />}
                        {resType === "valid" && <GoodCheckIcon />}
                      </span>
                    </Box>
                  </Flex>
                  <>
                    <>
                      {resType === "valid" && couponValue && (
                        <>
                          <span className="text-[12px] text-green-800 font-poppins-regular">
                            {couponAlert}
                          </span>
                        </>
                      )}
                    </>
                    <>
                      {resType === "invalid" && couponValue && (
                        <span>
                          <span className="text-[12px] text-red-500 font-poppins-regular">
                            {couponAlert}
                          </span>
                        </span>
                      )}
                    </>
                  </>
                </Box>
              )}
            </>
            <>
              {isPhone && (
                <div className="w-full">
                  <p className="block text-sm font-medium text-gray-700 mb-1 text-white">
                    Phone Number (optional)
                  </p>
                  <div className="w-full rounded-lg">
                    <PhoneInput
                      inputProps={{
                        required: true,
                        style: { fontSize: "16px" },
                      }}
                      country={"us"}
                      countryCodeEditable={false}
                      enableSearch
                      enableLongNumbers={false}
                      enableAreaCodes={true}
                      enableAreaCodeStretch
                      prefix="+"
                      autoFormat={false}
                      containerClass="phoneContainer"
                      inputClass="phoneInput"
                      buttonClass="btnBgColor"
                      value={checkoutDetails?.phone}
                      onChange={(
                        value: string,
                        data: any,
                        event: React.ChangeEvent<HTMLInputElement>,
                        formattedValue: string
                      ) => {
                        event.target.name = "phone";
                        event.target.value = formattedValue;
                        if (event?.type?.toLowerCase() === "change") {
                          handleInput(event);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </>
            {Boolean(total) && (
              <Radio.Group
                c={"white"}
                name="paymentservice"
                label={
                  <span className="text-sm  text-white">
                    Select Payment Service{" "}
                    {isLoading && (
                      <Loader
                        size={"sm"}
                        variant="dots"
                        color="primary_color"
                      />
                    )}
                  </span>
                }
                value={checkoutDetails?.paymentservice}
                onChange={(value) => {
                  const service = data?.data?.find(
                    (item: any) => item.name === value
                  );
                  setChechoutDetails({
                    ...checkoutDetails,
                    paymentservice: value,
                    paymentGateWay: service?._id || "",
                    selectedImageId: 0,
                  });
                }}
                description=""
                styles={() => ({
                  label: {
                    fontFamily: "poppins-regular",
                    fontSize: 12,
                    color: "gray",
                    marginTop: 4,
                  },
                })}>
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {data?.data
                    ?.filter((gateway: { active: boolean }) => gateway.active)
                    ?.map((method: any) => {
                      // Get all images for this payment method
                      const methodImages = paymentLogo.filter(
                        (image) => image.name === method?.name?.toLowerCase()
                      );

                      return methodImages.map((image) => (
                        <Group
                          key={`${method.name}-${image.id}`}
                          onClick={() => {
                            setChechoutDetails({
                              ...checkoutDetails,
                              paymentservice: method.name,
                              selectedImageId: image.id,
                              paymentGateWay: method?._id || "",
                            });
                          }}
                          className={`flex p-2 border items-center justify-center rounded-md hover:bg-background_color cursor-pointer ${
                            checkoutDetails?.paymentservice === method.name &&
                            checkoutDetails?.selectedImageId === image.id
                              ? "ring-2 ring-[#FF6B00] rounded-md"
                              : ""
                          }`}>
                          <div
                            className={`w-full relative transition-all duration-200 hover:scale-[1.02] overflow-hidden h-10 `}>
                            <Image
                              src={image.url}
                              alt={method.name}
                              fill
                              sizes="100vw"
                              // className="w-full h-full object-contain rounded-md"
                              style={{
                                aspectRatio: "3/2",
                                maxHeight: "60px",
                              }}
                            />
                            {checkoutDetails?.paymentservice === method.name &&
                              checkoutDetails?.selectedImageId === image.id && (
                                <div className="absolute top-2 right-2 w-4 h-4 bg-[#FF6B00] rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                          </div>
                        </Group>
                      ));
                    })}
                </div>
              </Radio.Group>
            )}
            {/* <>
              {event?.isPaidEvent && (
                <Flex>
                  <VisaIcon />
                  <MasterIcon />
                  <GooglePay />
                  <ApplePay />
                  <Paypal />
                </Flex>
              )}
            </> */}
            {/* <>
              {event?.isPaidEvent ? (
                <>
                  <Checkbox
                    checked
                    color="orange"
                    label="I agree to Ogaticket No refund policy.
"
                  />
                </>
              ) : (
                <>
                  <Checkbox
                    checked
                    color="orange"
                    label="I agree to Ogaticket terms & conditions.
"
                  />
                </>
              )}
            </> */}
            <div className="mt-4 ">
              <Button
                size="md"
                disabled={
                  !areFieldsNotEmptyAndBooleanTrue({
                    checked: checked,

                    email: checkoutDetails?.email,
                    name: checkoutDetails?.name,
                    paymentservice: Boolean(total)
                      ? checkoutDetails?.paymentservice
                      : "ogaticket",
                    isEmailConfirmed: isEmpty(user) ? !isEmailConfirmed : true,
                  })
                }
                loading={submit}
                color="white"
                type="submit"
                bg={"#EF790D"}
                fullWidth
                variant="white"
                fw={500}
                className="bg-secondary_color font-poppins-regular text-base capitalize text-white rounded-lg">
                Proceed
              </Button>
            </div>
          </Stack>
        </form>
      </div>
      <Box className="  md:w-[50%] md:max-w-[500px] bg-background_color p-3 rounded-lg h-fit   w-full ">
        <Box className="hidden md:flex ">
          <div className=" h-[300px]  w-full  ">
            <BackgroundImage
              src={image || imagePlaceholder}
              className="w-full h-[100%]"
            />
          </div>
        </Box>

        {(Boolean(ticketCategory) || finalTotalFee.total > 0) && (
          <Box className="text-primary_color md:p-[5px] ">
            <Text className="font-poppins-semibold   my-[5px]  text-sm text-primary_color">
              Total
            </Text>

            <Flex
              gap={4}
              align="center"
              className="cursor-pointer"
              onClick={() =>
                Boolean(finalTotalFee.total) && setOpenSummary(!openSummary)
              }>
              <Text className="font-poppins-semibold text-[30px] text-primary_color ">
                {currencysymbol || defaultCurrency}{" "}
                {Math.ceil(finalTotalFee?.total)?.toLocaleString() ||
                  defaultNumber}
              </Text>
              {Boolean(finalTotalFee.total) && <ArrowDownIcon />}
            </Flex>
            {openSummary && (
              <Box className="p-4 bg-white rounded-lg shadow-sm">
                {ticketCategory && (
                  <div className="space-y-3 ">
                    {ticketPayedFor?.map((ticket, index: number) => (
                      <Box
                        key={index}
                        className="flex justify-between items-center py-1 border-b border-gray-100">
                        <div className="flex-1">
                          <Text className="text-sm font-medium text-gray-800 capitalize">
                            {ticket?.name} * {ticket?.units}
                          </Text>
                        </div>
                        <Text className="text-sm font-medium text-gray-800">
                          {ticket?.currency?.symbol || defaultCurrency}
                          {ticket?.totalAmount?.toLocaleString() ||
                            defaultNumber}
                        </Text>
                      </Box>
                    ))}
                  </div>
                )}
                <Divider my={16} />
                {!isEmpty(wishList) && (
                  <Box className="flex justify-between items-center py-2 border-b border-gray-100">
                    <Text className="text-sm font-medium text-gray-800">
                      Wishlist Items ({wishList?.length})
                    </Text>
                    <Text className="text-sm font-medium text-gray-800">
                      {currencysymbol}{" "}
                      {wishList
                        ?.reduce(
                          (acc, curr) => acc + Math.round(curr?.price),
                          0
                        )
                        ?.toLocaleString()}
                    </Text>
                  </Box>
                )}

                <Box className="flex justify-between items-center pt-0">
                  <Text className="text-sm font-medium text-gray-600">
                    Transaction Fee
                  </Text>

                  <Text className="text-sm font-medium text-gray-800">
                    {currencysymbol}

                    {Math.ceil(finalTotalFee?.processingFee) || 0}
                  </Text>
                </Box>
                <Box className="flex justify-between items-center pt-0 mt-2">
                  <Text className="text-sm font-medium text-gray-600">
                    Platform Fee
                  </Text>

                  <Text className="text-sm font-medium text-gray-800">
                    {currencysymbol}

                    {Math.ceil(finalTotalFee?.platformFee) || 0}
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </div>
  );
}
