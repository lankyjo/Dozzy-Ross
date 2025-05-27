import {
  Text,
  Box,
  SimpleGrid,
  Button,
  Flex,
  ActionIcon,
  Modal,
} from "@mantine/core";
import Image from "next/image";
import { useContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";

import IconSuccess from "./icons/IconSuccess";
import IconFailure from "./icons/IconFailure";
import { mutate } from "swr";
import { TempValueContext } from "./utils/contextAPI/TempValueContext";
// import useGetter from "./utils/hooks/useGetter";
import {
  capitalizeNames,
  customErrorFunc,
  customNotification,
  defaultNumber,
  isEmpty,
  wishlistscreenImage,
} from "./utils/contextAPI/helperFunctions";
import { patchFunc, postFunc } from "./utils/request";
import GoBackIcon from "./icons/GoBackIcon";
import WishListCardCheckout from "./modal/subcomponents/WishListCardCheckout";
import TicketCheckout from "./modal/subcomponents/TicketCheckout";
import { useRouter } from "next/navigation";

type ModalProps = {
  opened: boolean;
  isWishlisted: boolean;
  setIsWishlisted: (state: boolean) => void;
  event: SingleEventProps;
  reservation?: {
    ticket: TicketGroup[];
    currentAmount: number;
    finalTotal: number;
  };
  ticketCategory: boolean;
  user: OrganizerProps;
  image?: string;
};
export default function WishLists() {
  const token = Cookies.get("access_token");
  const { val } = useContext(TempValueContext);
  const { reservation, event, ticketCategory, image, user, isWishlisted } =
    val as ModalProps;
  const [isWishListAvaliable, setIsWishListAvailable] = useState(isWishlisted);
  const [checked, setChecked] = useState<boolean>(true);
  const [showWishlistModal, setShowWishlistModal] = useState(true);
  const router = useRouter();
  const [wishListDisplay, setWishListDisplay] = useState(
    event?.wishlist?.map((wish) => ({ ...wish, isSelected: false }))
  );

  useEffect(() => {
    if (!val) {
      router.back();
    }
  }, [router, val]);
  // const { data: url } = useGetter("settings");
  const [checkoutDetails, setChechoutDetails] = useState<{
    name: string;
    email: string;
    paymentservice: string;
    cEmail: string;
    paymentGateWay: string;
    coupon: string;
    phone: string;
  }>({
    name: "",
    email: "",
    paymentservice: "",
    cEmail: "",
    paymentGateWay: "",
    coupon: "",
    phone: "",
  });
  const [wishLists, setWishLists] = useState([] as WishList[]);
  const [submit, setSubmit] = useState<boolean>(false);
  const [isPhone, setIsPhone] = useState<boolean>(false);
  const [isVerify, setIsVerify] = useState<boolean>(false);
  const ticketPayedFor = useMemo(() => {
    return reservation?.ticket.filter((ticket) => ticket.units > 0) || [];
  }, [reservation]);

  const total = useMemo(() => {
    if (!isEmpty(event?.wishlist)) {
      const wishListTotal = wishLists.reduce((total, wishList) => {
        return total + wishList.price;
      }, 0);

      return reservation?.finalTotal
        ? reservation.finalTotal + wishListTotal
        : wishListTotal;
    } else {
      return reservation?.finalTotal;
    }
  }, [wishLists, event?.wishlist, reservation?.finalTotal]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setChechoutDetails({ ...checkoutDetails, [name]: value });
  }

  async function handleUserPhoneUpdate() {
    const userProfile = {
      firstName: user?.firstName,
      lastName: user?.lastName,
      url: user?.imageUrl ?? "",
      username: user?.username,
      email: user?.email,
      phone: checkoutDetails?.phone,
      socialProfiles: user?.socialProfiles,
    };

    try {
      const res = await patchFunc<any>({
        values: userProfile,
        url: "user/profile",
      });
      if (res?.data?.success) {
        mutate("user");
      } else {
        customNotification("warning", res.data.message, "secondary_color.0");
      }
    } catch (error) {
      customErrorFunc(error);
    }
  }

  async function handleReservation<T>(payload: T): Promise<void> {
    setSubmit(true);
    if (token && checkoutDetails?.phone) await handleUserPhoneUpdate();

    try {
      const data = await postFunc({
        values: payload,
        url: "ticket/reservation",
      });

      customNotification(
        "Notification",
        data?.data?.message,
        "primary_color.0",
        <IconSuccess />
      );
      if (data?.data?.data?.paymentUrl) {
        // window.open(data?.data?.data?.paymentUrl, "_blank");
        window.location.href = data?.data?.data?.paymentUrl;
        // router.back();
        return;
      } else {
        router.push("/success");
      }
    } catch (error: any) {
      customNotification(
        "error",
        error?.response?.data?.message as string,
        "secondary_color.0",
        <IconFailure />
      );
    } finally {
      setSubmit(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!val) {
      customNotification(
        "Notification",
        "Select atleast one ticket or wishlist to checkout",
        "secondary_color.0"
      );
      return;
    }

    const email = checkoutDetails?.email?.toLowerCase();
    const username = capitalizeNames(checkoutDetails?.name);

    const tickets = ticketPayedFor.map((ticket) => ({
      ticketGroup: ticket._id,
      quantity: ticket.units,
    }));

    const wishlists = wishLists.map((wish) => ({
      eventWishlist: wish._id,
      quantity: 1,
    }));

    const payload = {
      fullName: username,
      email: email,
      paymentMethod: checkoutDetails?.paymentGateWay,
      tickets: tickets,
      wishlists: wishlists,
      eventId: event?._id,
      followOrganizer: true,
      buyingForSomeoneElse: false,
      // loggedInUserId: user?._id || "",
      couponCode: isVerify ? checkoutDetails.coupon.toUpperCase() : null,
      phone: checkoutDetails?.phone
        ? checkoutDetails.phone
        : user?.phone
        ? user.phone
        : null,
      successRedirectUrl: `${process.env.NEXT_PUBLIC_ORGANIZER_PLATFORM_FRONTEND_URL}/success`,
    };

    if (!isEmpty(tickets) || !isEmpty(wishLists)) {
      await handleReservation(payload);
      return;
    }

    if (!event?.isPaidEvent && isEmpty(tickets) && isEmpty(wishLists)) {
      const {
        tickets,
        wishlists,
        paymentMethod,
        followOrganizer,
        buyingForSomeoneElse,
        // loggedInUserId,
        ...rest
      } = payload;
      console.log(
        tickets &&
          wishlists &&
          paymentMethod &&
          followOrganizer &&
          buyingForSomeoneElse
      );

      await handleReservation(rest);
    } else {
      customNotification(
        "Notification",
        "This is a paid event, please select at least one ticket or wishlist",
        "secondary_color.0"
      );
    }
  }

  function handleWishListSelection(wishList: WishList) {
    const findWish = wishLists.find((list) => list?._id === wishList?._id);
    if (findWish) {
      setWishLists(wishLists.filter((list) => list?._id !== wishList?._id));
    } else {
      setWishLists([...wishLists, wishList]);
    }

    const exactWishList = wishListDisplay?.map((wish) =>
      wish?._id === wishList?._id
        ? { ...wish, isSelected: !wish?.isSelected }
        : { ...wish }
    );
    setWishListDisplay(exactWishList);
  }

  const handleBackClick = () => {
    const confirmed = window.confirm(
      "Do you want to close the registration process?"
    );
    if (confirmed) {
      router.back();
    }
  };

  const handleBackClickForCheckout = () => {
    const confirmed = window.confirm(
      "Do you want to close the registration process?"
    );
    if (confirmed) {
      setIsWishListAvailable(true);
    }
  };

  return (
    <Box className="h-full flex flex-col w-full relative">
      <>
        {isWishListAvaliable && showWishlistModal ? (
          <Modal
            opened={showWishlistModal}
            onClose={() => setShowWishlistModal(false)}
            centered
            size="lg"
            styles={{
              header: { display: "none" },
              body: { padding: "20px 20px" },
            }}>
            <Box className="text-center h-full w-full flex flex-col justify-between  items-center">
              <Box className="flex flex-col justify-between h-full w-full">
                <Box h={100} w={200} mx="auto" mt={20}>
                  <Image
                    src={wishlistscreenImage}
                    alt="Gift image"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </Box>
                <Text className="text-center text-sm text-secondary_color mt-2 font-poppins-medium mb-10">
                  Would you like to see my wishlist items?
                </Text>
              </Box>

              <Flex gap={16} justify="center" w="100%" mt={50}>
                <Button
                  onClick={() => {
                    setShowWishlistModal(false);
                    setIsWishListAvailable(true);
                  }}
                  className="bg-secondary_color hover:bg-secondary_color/90 text-white font-poppins-regular  px-2 py-2 rounded-lg w-[50%]">
                  See Wishlist
                </Button>
                <Button
                  onClick={() => {
                    setShowWishlistModal(false);
                    setIsWishListAvailable(false);
                  }}
                  className="bg-white border-2 border-secondary_color text-secondary_color hover:bg-secondary_color/10 font-poppins-regular  px-2 py-2 rounded-lg w-[50%]">
                  Proceed to make reservation
                </Button>
              </Flex>
            </Box>
          </Modal>
        ) : null}

        {isWishListAvaliable ? (
          <>
            <Box px={8} pb={100} pos="relative">
              <ActionIcon
                pos="absolute"
                top={20}
                variant="transparent"
                bg="gray.5"
                radius={100}
                size={40}
                onClick={() => {
                  handleBackClick();
                }}>
                <GoBackIcon />
              </ActionIcon>
              <Box h={100} w={200} mx="auto" mt={20}>
                <Image
                  src={wishlistscreenImage}
                  alt="Gift image"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </Box>
              <Text className="text-center text-sm text-secondary_color mt-2 font-poppins-medium">
                If you wish to gift me, here is my wishlist
              </Text>
              <Box mt={30} className="flex justify-center items-center  ">
                <SimpleGrid
                  className="w-full"
                  cols={{ base: 1, "36rem": 2, "60rem": 3, "82rem": 4 }}
                  spacing={{ base: 10, "36rem": 20, "60rem": 30, "82rem": 40 }}>
                  {wishListDisplay?.map((wishlist) => (
                    <WishListCardCheckout
                      key={wishlist?._id}
                      wishlist={wishlist}
                      handleWishListSelection={handleWishListSelection}
                      currency={event?.currency?.symbol || ""}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            </Box>

            <Box className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 mt-20 ">
              {wishLists?.length > 0 && (
                <Flex
                  justify="center"
                  align="center"
                  gap={8}
                  mb={3}
                  className="mx-auto">
                  <Text className="font-poppins-medium text-gray-700">
                    Total Selected:
                  </Text>
                  <Text className="font-poppins-semibold text-primary_color">
                    {event?.currency?.symbol || ""}{" "}
                    {wishLists
                      ?.reduce((acc, curr) => acc + Math.round(curr?.price), 0)
                      ?.toLocaleString()}
                  </Text>
                </Flex>
              )}
              <Flex justify="center">
                {wishLists?.length > 0 ? (
                  <Button
                    h={44}
                    variant="white"
                    onClick={() => setIsWishListAvailable(false)}
                    maw={500}
                    fw={500}
                    className="bg-secondary_color w-full rounded-lg cursor-pointer text-white text-[17px] capitalize font-poppins-medium">
                    Continue
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsWishListAvailable(false)}
                    h={44}
                    variant="white"
                    maw={500}
                    fw={500}
                    className="border-secondary_color border-2 bg-white w-full hover:bg-secondary_color/10 cursor-pointer text-secondary_color rounded-lg text-[17px] capitalize font-poppins-medium transition-colors duration-200">
                    skip
                  </Button>
                )}
              </Flex>
            </Box>
          </>
        ) : (
          <Box mt={30} pos="relative">
            <ActionIcon
              pos="absolute"
              top={{ base: 0, md: 20 }}
              variant="transparent"
              bg="gray.5"
              radius={100}
              size={40}
              onClick={() => {
                if ((wishListDisplay?.length ?? 0) > 0) {
                  handleBackClickForCheckout();
                } else {
                  handleBackClick();
                }
              }}>
              <GoBackIcon />
            </ActionIcon>
            <TicketCheckout
              checked={checked}
              setChecked={setChecked}
              checkoutDetails={checkoutDetails}
              handleInput={handleInput}
              handleSubmit={handleSubmit}
              // close={close}
              isPhone={isPhone}
              setIsPhone={setIsPhone}
              reservation={reservation}
              ticketCategory={ticketCategory}
              setChechoutDetails={setChechoutDetails}
              ticketPayedFor={ticketPayedFor}
              event={event}
              image={image}
              user={user}
              total={total || defaultNumber}
              wishList={wishLists}
              submit={submit}
              setIsVerify={setIsVerify}
              isVerify={isVerify}
            />
          </Box>
        )}
      </>
    </Box>
  );
}
