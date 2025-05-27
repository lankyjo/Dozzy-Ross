import { useMemo } from "react";
import {
  checkEventType,
  startCase,
  toLower,
} from "../contextAPI/helperFunctions";

export default function useFormatSingleEventData(
  data: SingleEventProps,
  isLoading?: boolean
): SingleEventProps {
  const events = useMemo<any>(() => {
    if (!isLoading && data) {
      const { banner, category, seatCapacity, ...rest }: SingleEventProps =
        data;
      let ticketGroups = data.ticketGroups;

      const _id = category?._id;
      const name = category?.name;
      const description = category?.description;
      const image = category?.image;
      const isDeleted = category?.isDeleted;
      const screenposition = category?.screenposition;
      const mobilescreenposition = category?.mobilescreenposition;
      const logo = category?.logo;

      ticketGroups = ticketGroups?.filter(
        (ticketId: TicketGroup) => Number(ticketId?.quantity) !== 0
      );

      return {
        ...rest,
        data,
        event_title: rest?.title,
        image: banner?.url,
        ticketGroups,
        approvalStatus: rest.approvalStatus,
        seatCapacity,
        category: {
          _id: _id,
          name: name,
          description: description,
          image: image,
          isDeleted: isDeleted,
          screenposition: screenposition,
          mobilescreenposition: mobilescreenposition,
          logo: logo,
          link: "",
        },
        venue: checkEventType(rest.eventLocationType, {
          primaryVenue: {
            address: rest.primaryVenue?.address,
            city: rest.primaryVenue?.city,
            state: rest.primaryVenue?.state,
            country: rest.primaryVenue?.country,
          },
          onlineVenue: {
            platform: rest?.onlineVenue?.platform,
            url: rest?.onlineVenue?.url,
            additionalInfo: rest?.onlineVenue?.additionalInfo,
          },
        }),
        organizer: {
          firstName: `${rest.organizer?.firstName} `,
          lastName: `${rest.organizer?.lastName}`,
          isVerified: rest.organizer?.isVerifiedOrganizer,
          email: rest.organizer?.email,
          phone: rest.organizer?.phone,
          username: startCase(toLower(rest.organizer?.username || "")),
          socialProfiles: rest.organizer?.socialProfiles,
          _id: rest.organizer?._id,
          imageUrl: rest.organizer?.imageUrl,
          totalEventsCreated: rest?.organizer?.totalEventsCreated,
          totalFollowers: rest?.organizer?.totalFollowers,
          usernameSlug: rest.organizer?.usernameSlug,
        },
        description: rest?.description,
      };
    } else {
      return {
        banner: { url: "" },
        data,
        image: "",
        eventLocationType: "",
        approvalStatus: "",
        _id: "",
        seatCapacity: 0,
        category: {
          _id: "",
          name: "",
          description: "",
          image: "",
          isDeleted: false,
          screenposition: 0,
          mobilescreenposition: 0,
          logo: "",
          link: "",
        },
        counter_event_date: "",
        currency: {
          createdAt: "",
          isActive: false,
          isDeleted: false,
          name: "",
          symbol: "",
          updatedAt: "",
          _id: "",
        },
        date_event_date: "",
        date: "",
        duration: "",
        endDate: "",
        event_title: "",
        fee: "",
        isDeleted: false,
        isFeatured: false,
        isPaidEvent: false,
        isPrivateEvent: false,
        isSoldOut: false,
        location: "",
        qrcode: "",
        slug: "",
        startDate: "",
        subCategory: {
          _id: "",
          name: "",
          description: "",
          image: "",
          isDeleted: false,
          screenposition: 0,
          mobilescreenposition: 0,
          logo: "",
          link: "",
        },
        venue: { venue: "", link: "" },
        minTicket: {
          price: 0,
          currency: {
            createdAt: "",
            isActive: false,
            isDeleted: false,
            name: "",
            symbol: "",
            updatedAt: "",
            _id: "",
          },
        },
        onlineVenue: {
          platform: "",
          url: "",
          additionalInfo: "",
        },
        organizer: {
          firstName: "",
          lastName: "",
          isVerifiedOrganizer: false,
          socialProfiles: [{ name: "", url: "" }],

          accountClosedReason: "",
          createdAt: "",
          deactivated: true,
          dob: "",
          email: "",
          emailVerified: false,

          fullName: "",
          imageUrl: "",
          isDeleted: "",

          phone: "",
          referralCode: "",
          referredBy: "",
          role: "",

          totalReferrals: 0,
          updatedAt: "",
          username: "",

          _id: "",
        },
        primaryVenue: {
          address: "",
          city: "",
          country: "",
          latitude: "",
          longitude: "",
          region: "",
          state: "",
        },
        description: "",
        socials: [],
        ticketGroups: [
          {
            category: "",
            name: "",
            amount: 0,
            description: "",
            quantity: 0,
            sales: 0,
            available: 0,
            _id: "",
            totalAmount: 0,
            units: 0,
            currency: {
              createdAt: "",
              isActive: false,
              isDeleted: false,
              name: "",
              symbol: "",
              updatedAt: "",
              _id: "",
            },
          },
        ],

        title: "",
        qrCode: "",
      };
    }
  }, [data, isLoading]);

  return events;
}
