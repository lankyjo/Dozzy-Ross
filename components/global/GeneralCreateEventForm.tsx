"use client";

import {
  Box,
  Stack,
  Group,
  Button,
  Stepper,
  Text,
  Checkbox,
  Paper,
  //Textarea,
  TextInput,
  FileInput,
  Radio,
  Select,
  Loader,
} from "@mantine/core";
import { FormEvent, useState, useEffect } from "react";
import { useForm, UseFormReturnType } from "@mantine/form";
import Link from "next/link";
import EventDateTime from "@/components/form/create-event/eventDateTime";
import EventTicket from "@/components/form/create-event/EventTicket";
import QuestionRadiobox from "@/components/form/create-event/QuestionRadiobox";
//import ServiceFee from "@/components/form/create-event/ServiceFee";
import AgeLimit from "../form/create-event/AgeLimit";
import EventDescriptionEditor from "../form/create-event/EventDescriptionEditor";
import { IconUpload } from "@tabler/icons-react";
import React from "react";
import {
  calculateDuration,
  capitalizeFirstLetter,
} from "@/utils/helperFunction";
import { mutate } from "swr";
import axiosInstance from "../utils/axiosInstance";
import axios from "axios";
import { customErrorFunc } from "../utils/contextAPI/helperFunctions";

import useSelectData from "@/components/utils/hooks/useSelectData";
import { postFunc } from "../utils/request";
import { useRouter } from "next/navigation";
import usePost from "../utils/hooks/usePost";
import { useDebounce } from "../utils/hooks/useDebounce";
import GoodCheckIcon from "../icons/GoodCheckIcon";

// Mock data for selects
// const categoryOptions = [
//   { value: "music", label: "Music" },
//   { value: "sports", label: "Sports" },
//   { value: "art", label: "Art & Culture" },
//   { value: "food", label: "Food & Drinks" },
//   { value: "business", label: "Business" },
//   { value: "education", label: "Education" },
//   { value: "health", label: "Health & Wellness" },
//   { value: "love", label: "Love & Romance" },
//   { value: "party", label: "Party & Hangouts" },
// ];

// Initial form values
const createEventInitialValues = {
  banner: { url: "" },
  editBanner: {},
  eventTitle: "",
  subcategory: "",
  category: "",
  description: "",
  startDate: new Date(),
  endDate: new Date(),
  type: "standard",
  eventLocationType: "physical",
  virtualLinkName: "",
  virtualLink: "",
  venueAddress: "",
  state: "",
  country: "",
  maxCap: "",
  isFree: "yes",
  isPrivate: "no",
  feePayer: "user",
  acceptedCurr: "",
  wishes: [],
  tickets: [],
  participantImage: [],
  isWishlist: "no",
  acceptTerms: false,
  eventPhotos: [],
  ageRestriction: "no",
  ageLimit: "0",
  tourLocation: [],
  tourEventId: "",
  eventId: "",
  brideName: "",
  groomName: "",
  teamOne: "",
  teamTwo: "",
  bannerFile: null,
  ticketCat: "",
  ticketPrice: "",
  ticketQty: "",
  ticketDesc: "",
  ticketsPerPurchase: 1,
};

// interface SubcategoryMapping {
//   [key: string]: { value: string; label: string }[];
// }

// const subcategoryOptions: SubcategoryMapping = {
//   music: [
//     { value: "concert", label: "Concert" },
//     { value: "festival", label: "Festival" },
//     { value: "live_performance", label: "Live Performance" },
//   ],
//   sports: [
//     { value: "football", label: "Football" },
//     { value: "basketball", label: "Basketball" },
//     { value: "tennis", label: "Tennis" },
//   ],
//   art: [
//     { value: "exhibition", label: "Exhibition" },
//     { value: "theater", label: "Theater" },
//     { value: "museum", label: "Museum" },
//   ],
//   food: [
//     { value: "food_festival", label: "Food Festival" },
//     { value: "wine_tasting", label: "Wine Tasting" },
//     { value: "cooking_class", label: "Cooking Class" },
//   ],
//   business: [
//     { value: "conference", label: "Conference" },
//     { value: "networking", label: "Networking" },
//     { value: "workshop", label: "Workshop" },
//   ],
//   education: [
//     { value: "seminar", label: "Seminar" },
//     { value: "webinar", label: "Webinar" },
//     { value: "training", label: "Training" },
//   ],
//   health: [
//     { value: "yoga", label: "Yoga" },
//     { value: "fitness", label: "Fitness" },
//     { value: "meditation", label: "Meditation" },
//   ],
//   love: [
//     { value: "wedding", label: "Wedding" },
//     { value: "engagement", label: "Engagement" },
//     { value: "anniversary", label: "Anniversary" },
//   ],
//   party: [
//     { value: "birthday", label: "Birthday" },
//     { value: "night_out", label: "Night Out" },
//     { value: "social", label: "Social Gathering" },
//   ],
// };

// Define types for form values and handler functions
export interface EventFormValues {
  banner: { url: string };
  editBanner: any;
  eventTitle: string;
  subcategory: string;
  category: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: string;
  eventLocationType: string;
  virtualLinkName: string;
  virtualLink: string;
  venueAddress: string;
  state: string;
  country: string;
  city?: string;
  maxCap: string;
  isFree: string;
  isPrivate: string;
  feePayer: string;
  acceptedCurr: string;
  wishes: any[];
  tickets: any[];
  participantImage: any[];
  isWishlist: string;
  acceptTerms: boolean;
  eventPhotos: any[];
  ageRestriction: string;
  ageLimit: string;
  tourLocation: any[];
  tourEventId: string;
  eventId: string;
  brideName: string;
  groomName: string;
  teamOne: string;
  teamTwo: string;
  bannerFile: any;
  ticketCat: string;
  ticketPrice: string;
  ticketQty: string;
  ticketDesc: string;
  ticketsPerPurchase: number;
}

interface CreateEventHandlerParams {
  values: EventFormValues;
  event: FormEvent | undefined;
  setLoader: (value: boolean) => void;
  setShowDialog: (value: boolean) => void;
  setshowEventDialogue: (value: {
    success: boolean;
    message: string;
    error: boolean;
  }) => void;
  form: any;
}

async function handleCreateEvent({
  values,
  event,
  setLoader,
  setShowDialog,
  setshowEventDialogue,
  form,
}: CreateEventHandlerParams) {
  event?.preventDefault();
  setLoader(true);

  const startDate = new Date(values.startDate).toISOString();
  const endDate = new Date(values.endDate).toISOString();
  const { duration } = calculateDuration({ startDate, endDate });

  const eventPrimaryVenuePayload = {
    address: values.venueAddress,
    city: values?.city,
    state: values?.state,
    country: values?.country,
    region: "",
    longitude: "",
    latitude: "",
  };

  const ticketGroupsPayload = values.tickets.map((ticket: any) => ({
    name: ticket.ticketCat,
    amount: ticket?.ticketPrice,
    currency: ticket?.acceptedCurr,
    description: ticket?.ticketDesc,
    quantity: ticket?.ticketQty,
    ticketsPerPurchase: ticket?.ticketsPerPurchase,
  }));

  const eventOnlineVenuePayload = {
    platform: values.virtualLinkName,
    url: values.virtualLink,
    additionalInfo: "",
  };

  const eventWishListPayload = values.wishes.map((wish) => ({
    price: wish?.price,
    currency: values.acceptedCurr,
    image: wish?.image,
    name: wish?.name,
    description: wish?.description,
    isCustom: wish?.isCustom,
  }));

  const formObject = {
    banner: values.banner,
    images: values.eventPhotos,
    title: values.eventTitle,
    description: values.description,
    category: values.category,
    subCategory: values.subcategory,
    startDate,
    endDate,
    duration,
    eventLocationType: capitalizeFirstLetter(
      values.eventLocationType
    )?.toLowerCase(),
    seatCapacity: values?.maxCap ? `${values.maxCap}` : "0",
    feePayer: values?.feePayer?.toLowerCase(),
    currency: values.acceptedCurr,
    brideName: values.brideName,
    groomName: values.groomName,
    teamOne: values.teamOne,
    teamTwo: values.teamTwo,
    ageLimit: Number(values.ageLimit),
    type: values.type?.toLowerCase(),
    isPaidEvent: values.isFree === "no",
    isPrivateEvent: values.isPrivate === "yes",
    rsvp: values.eventLocationType === "none",
    ticketGroups: ticketGroupsPayload,
    wishlist: values.wishes.length > 0 ? eventWishListPayload : undefined,
    ...(values.participantImage?.length > 0 && {
      participantImages: values.participantImage,
    }),
    ...(values.eventLocationType?.toLowerCase() === "physical"
      ? {
          primaryVenue: eventPrimaryVenuePayload,
        }
      : {}),
    ...(values.eventLocationType?.toLowerCase() === "online"
      ? {
          onlineVenue: eventOnlineVenuePayload,
        }
      : {}),
    ...(values.eventLocationType?.toLowerCase() === "hybrid"
      ? {
          primaryVenue: eventPrimaryVenuePayload,
          onlineVenue: eventOnlineVenuePayload,
        }
      : {}),
  };

  try {
    const res = await postFunc<any>({
      url: "event",
      values: formObject,
    });

    if (res?.data?.success) {
      // If creating a ticket is needed after event creation
      if (values.isFree === "no" && ticketGroupsPayload.length > 0) {
        try {
          for (const ticket of ticketGroupsPayload) {
            await postFunc<any>({
              url: "ticket-group",
              values: {
                eventId: res?.data?.data?._id,
                name: ticket.name,
                amount: Number(ticket.amount),
                description: ticket.description || "",
                quantity: Number(ticket.quantity),
                ticketsPerPurchase: Number(ticket.ticketsPerPurchase) || 1,
              },
            });
          }
        } catch (ticketError) {
          console.error("Error creating tickets:", ticketError);
        }
      }

      setshowEventDialogue({
        success: true,
        message: "Event created successfully! Awaiting approval.",
        error: false,
      });
      setShowDialog(true);
      mutate("event/my-events?page=1&size=50");
      form.reset();
    }
  } catch (error: any) {
    console.error("Error creating event:", error);
    setshowEventDialogue({
      success: false,
      message: error?.response?.data?.message || "Error creating event",
      error: true,
    });
    setShowDialog(true);
  } finally {
    setLoader(false);
  }
}

const handleImageConvertUpload = async ({
  file,
  form,
  setIsUpload,
}: {
  file: File[];
  form: UseFormReturnType<EventFormValues>;
  setIsUpload: (val: boolean) => void;
}) => {
  if (!file.length) throw new Error("No file selected");

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result;

    setIsUpload(true);

    try {
      // You can now use the base64Image for your API call or other logic
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      // image returned is in Buffer(binary) format (Node.js)
      await response.json();
      // request for pre-signed url
      const url =
        process.env.NEXT_PUBLIC_BASE_API_URL + "media-upload/pre-signed-url";
      const reqRes = await axiosInstance.post(url, {
        folder: "event",
        mimeType: "image/jpeg",
      });

      if (reqRes?.data?.success) {
        await axios.put(reqRes.data.data.uploadUrl, file[0], {
          headers: {
            "Content-Type": file[0].type,
          },
        });
        form.setFieldValue("banner.url", reqRes.data.data.fileUrl);
        form.setFieldValue("bannerFile", file);
      }
    } catch (error) {
      customErrorFunc(error);
    } finally {
      setIsUpload(false);
    }
  };
  reader.readAsDataURL(file[0]);
};

export default function GeneralCreateEventForm() {
  const [loader, setLoader] = useState<boolean>(false);
  const [showDialogue, setShowDialog] = useState(false);
  const [showEventDialogue, setshowEventDialogue] = useState({
    success: false,
    message: "",
    error: false,
  });
  const [active, setActive] = useState(0);
  const [selectedType, setSelectedType] = useState<{
    id: string;
    name: string;
  }>({ id: "", name: "" });
  const router = useRouter();

  // const [subcategories, setSubcategories] = useState<
  //   { value: string; label: string }[]
  // >([]);
  const [isUpload, setIsUpload] = useState(false);

  const { data: categoryOptions, isLoading: categoryLoading } =
    useSelectData("category");

  const form = useForm<EventFormValues>({
    initialValues: createEventInitialValues,
    validate: {
      eventTitle: (value: string) => {
        if (!value?.trim()) {
          return "Event title is required";
        }

        const wordCount = value?.trim().length;
        if (wordCount >= 100) {
          return `Event title should not exceed 100 characters. Currently: ${wordCount} characters.`;
        }

        return null;
      },
      subcategory: (value: string) =>
        value?.trim() ? null : "Sub-category is required",
      category: (value: string) =>
        !value ? "Please select an event category" : null,
      acceptedCurr: (value: string) => {
        if (form.values.isFree === "yes") {
          return null;
        }
        return selectedType?.name?.toLowerCase() !== "love"
          ? value?.trim()
            ? null
            : "Required"
          : null;
      },
      description: (value: string) => {
        // const wordCount = value?.trim()?.length;
        // if (wordCount > 1000) {
        //   return `Description should not exceed 1000 characters. Currently: ${wordCount} characters.`;
        // }
        if (!Boolean(value)) {
          return "Required";
        }
        return null;
      },
      ageLimit: (value: string) => {
        if (Number(value) < 0) {
          return "Enter a valid number";
        }
        if (!Boolean(value)) {
          return "Required";
        }
        return null;
      },
      acceptTerms: (value: boolean) => {
        return Boolean(value) ? null : "Required";
      },
    },
    validateInputOnChange: true,
    validateInputOnBlur: true,
  });

  const { trigger, data, isLoading } = usePost("event/check-name-availability");

  const debouncedValue = useDebounce(form.values.eventTitle, 500);

  useEffect(() => {
    if (!debouncedValue) return;
    trigger({
      title: debouncedValue,
    });
  }, [debouncedValue, trigger]);

  const { data: subcategories, isLoading: subCategoryLoading } = useSelectData(
    form?.values?.category
      ? `category/sub-categories?categoryId=${form?.values?.category}`
      : null
  );

  useEffect(() => {
    if (form.values.ageRestriction?.toLowerCase() === "no") {
      form.setFieldValue("ageLimit", "0");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.ageRestriction]);

  function handleValidationCheck() {
    const checkValidation = false;
    const startDate = new Date(form.values.startDate)?.toISOString();
    const endDate = new Date(form.values.endDate)?.toISOString();

    let checkDate = "";

    if (new Date().getTime() > new Date(startDate).getTime()) {
      checkDate = "Event Start Date cannot be less than now";
    }

    if (new Date(endDate).getTime() <= new Date(startDate).getTime()) {
      checkDate = "Event End Date cannot be less than Event Start Date";
    }

    // Basic validation for required fields
    if (!form.values.banner?.url && !form.values.bannerFile) {
      alert("Event banner is required");
      return true;
    }

    if (!form.values.eventTitle) {
      alert("Event title is required");
      return true;
    }

    if (!form.values.subcategory) {
      alert("Sub-category is required");
      return true;
    }

    if (!form.values.description) {
      alert("Description is required");
      return true;
    }

    // Event location validation
    if (
      form.values.eventLocationType === "physical" &&
      !form.values.venueAddress
    ) {
      alert("Venue address is required");
      return true;
    }

    if (
      form.values.eventLocationType === "online" &&
      (!form.values.virtualLinkName || !form.values.virtualLink)
    ) {
      alert("Virtual event details are required");
      return true;
    }

    // Date validation
    if (!isEmpty(checkDate)) {
      alert(checkDate);
      return true;
    }

    return checkValidation;
  }

  const nextStep = async () => {
    const isInvalid = handleValidationCheck();
    if (isInvalid) return;
    setActive((current) => (current < 2 ? current + 1 : current));
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  const handleCategoryChange = (value: string | null) => {
    if (value) {
      form.setFieldValue("category", value);
      form.setFieldValue("subcategory", "");
      // setSubcategories(subcategoryOptions[value] || []);

      // Set the selected type for more complex form logic
      const category = categoryOptions.find((cat) => cat.value === value);
      if (category) {
        setSelectedType({
          id: category.value,
          name: category.label.toLowerCase().split(" ")[0],
        });
      }
    }
  };

  async function handleSubmitEvent({
    values,
    event,
  }: {
    values: any;
    event: FormEvent | undefined;
  }) {
    await handleCreateEvent({
      values,
      event,
      setLoader,
      setShowDialog,
      setshowEventDialogue,
      form,
    });
  }

  function isEmpty(value: any) {
    return (
      value === undefined ||
      value === null ||
      (typeof value === "object" && Object.keys(value).length === 0) ||
      (typeof value === "string" && value.trim().length === 0) ||
      (Array.isArray(value) && value.length === 0)
    );
  }

  return (
    <div className="w-full pt-[46px] pb-[55px] bg-black/100 mt-14">
      <Box className="w-full px-4 xl:px-[100px]">
        <form
          onSubmit={form.onSubmit((values: any, event: any) => {
            handleSubmitEvent({ values, event });
          })}>
          <Stepper
            color="yellow"
            active={active}
            onStepClick={setActive}
            size="sm"
            allowNextStepsSelect={false}
            styles={{
              stepLabel: {
                fontSize: 18,
                fontFamily: "poppins-medium",
              },
              stepDescription: {
                fontSize: 12,
                fontFamily: "poppins-regular",
              },
            }}>
            <Stepper.Step
              label="Event Details"
              description="Tell us about your event">
              <Paper
                withBorder
                p="md"
                radius="md"
                className="mt-6 mb-6 bg-gray-500">
                <Stack gap="xl">
                  <Box>
                    <Text
                      size="lg"
                      fw={600}
                      className="pb-2 border-b border-gray-200">
                      Event Banner
                    </Text>
                    <FileInput
                      label="Event Banner Image"
                      description="Upload your event banner image"
                      placeholder="Click to upload"
                      accept="image/png,image/jpeg,image/webp"
                      leftSection={<IconUpload size={14} />}
                      rightSection={
                        isUpload ? <Loader size={20} color="#EF790D" /> : null
                      }
                      withAsterisk
                      {...form.getInputProps("bannerFile")}
                      onChange={(e) => {
                        handleImageConvertUpload({
                          file: e ? [e] : [],
                          setIsUpload,
                          form,
                        });
                      }}
                    />
                  </Box>

                  <Box>
                    <Text
                      size="lg"
                      fw={600}
                      className="pb-2 border-b border-gray-200">
                      Event Category
                    </Text>
                    <Select
                      label="Event Category"
                      rightSection={
                        categoryLoading ? <Loader type="dots" /> : null
                      }
                      placeholder="Select a category"
                      data={categoryOptions}
                      withAsterisk
                      {...form.getInputProps("category")}
                      onChange={handleCategoryChange}
                    />

                    <Box mt="md">
                      <Select
                        label="Event Subcategory"
                        placeholder="Select a subcategory"
                        rightSection={
                          subCategoryLoading ? <Loader type="dots" /> : null
                        }
                        data={subcategories}
                        withAsterisk
                        disabled={!form.values.category}
                        {...form.getInputProps("subcategory")}
                      />
                    </Box>
                  </Box>

                  <Box>
                    <Text
                      size="lg"
                      fw={600}
                      className="pb-2 border-b border-gray-200">
                      Event Details
                    </Text>
                    <div>
                      <TextInput
                        label="Event Title"
                        placeholder="Enter your event title"
                        withAsterisk
                        {...form.getInputProps("eventTitle")}
                        rightSection={
                          <>
                            {isLoading && <Loader size={20} color="#EF790D" />}

                            {data?.data?.isAvailable &&
                              !isLoading &&
                              form?.values?.eventTitle && <GoodCheckIcon />}
                          </>
                        }
                      />
                      <div
                        className={` text-red-400 text-xs   ${
                          data?.success &&
                          !data?.data?.isAvailable &&
                          form?.values?.eventTitle
                            ? "opacity-100"
                            : "opacity-0"
                        }`}>
                        Event title already taken
                      </div>
                    </div>

                    <Box mt="md">
                      <EventDescriptionEditor
                        form={form}
                        label="Event Description"
                      />
                    </Box>
                  </Box>

                  <Box>
                    <Text
                      size="lg"
                      fw={600}
                      className="pb-2 border-b border-gray-200">
                      Event Schedule
                    </Text>
                    <EventDateTime form={form} isEdit={false} />
                  </Box>

                  <Box>
                    <Text
                      size="lg"
                      fw={600}
                      className="pb-2 border-b border-gray-200">
                      Event Location
                    </Text>
                    <Radio.Group
                      name="eventLocationType"
                      label="Where will this event be held?"
                      description="Select the type of venue"
                      withAsterisk
                      {...form.getInputProps("eventLocationType")}>
                      <Group mt="xs">
                        <Radio value="physical" label="Physical Venue" />
                        <Radio value="online" label="Online" />
                        <Radio
                          value="hybrid"
                          label="Hybrid (Physical & Online)"
                        />
                      </Group>
                    </Radio.Group>

                    {(form.values.eventLocationType === "physical" ||
                      form.values.eventLocationType === "hybrid") && (
                      <Group grow mt="md">
                        <TextInput
                          label="Venue Address"
                          placeholder="Enter venue address"
                          withAsterisk
                          {...form.getInputProps("venueAddress")}
                        />

                        <TextInput
                          label="State/Province"
                          placeholder="Enter state or province"
                          {...form.getInputProps("state")}
                        />

                        <TextInput
                          label="Country"
                          placeholder="Enter country"
                          {...form.getInputProps("country")}
                        />
                      </Group>
                    )}

                    {(form.values.eventLocationType === "online" ||
                      form.values.eventLocationType === "hybrid") && (
                      <Group grow mt="md">
                        <TextInput
                          label="Platform Name"
                          placeholder="e.g., Zoom, Teams, Google Meet"
                          {...form.getInputProps("virtualLinkName")}
                        />

                        <TextInput
                          label="Meeting Link"
                          placeholder="Enter meeting URL"
                          {...form.getInputProps("virtualLink")}
                        />
                      </Group>
                    )}
                  </Box>

                  {selectedType?.name === "love" && (
                    <Box>
                      <Text
                        size="lg"
                        fw={600}
                        className="pb-2 border-b border-gray-200">
                        Couple Information
                      </Text>
                      <Group grow mt="md">
                        <TextInput
                          label="Partner 1 Name"
                          placeholder="Enter name"
                          {...form.getInputProps("brideName")}
                        />
                        <TextInput
                          label="Partner 2 Name"
                          placeholder="Enter name"
                          {...form.getInputProps("groomName")}
                        />
                      </Group>
                    </Box>
                  )}

                  {selectedType?.name === "sport" && (
                    <Box>
                      <Text
                        size="lg"
                        fw={600}
                        className="pb-2 border-b border-gray-200">
                        Teams Information
                      </Text>
                      <Group grow mt="md">
                        <TextInput
                          label="Team One"
                          placeholder="Enter team name"
                          {...form.getInputProps("teamOne")}
                        />
                        <TextInput
                          label="Team Two"
                          placeholder="Enter team name"
                          {...form.getInputProps("teamTwo")}
                        />
                      </Group>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Stepper.Step>

            {/* Step 2: Event Access */}
            <Stepper.Step label="Event Access" description="Access information">
              <Stack gap={30}>
                {/* Ticket Information */}
                <Paper
                  withBorder
                  p="md"
                  radius="md"
                  className="mt-6 mb-6 bg-gray-50">
                  <Text
                    size="lg"
                    fw={600}
                    className="pb-2 border-b border-gray-200">
                    Ticket Information
                  </Text>

                  <Box className="py-4">
                    <EventTicket form={form} />
                  </Box>

                  {/* <Box className="mt-6">
                    <ServiceFee form={form} />
                  </Box> */}
                </Paper>

                {/* Event Restrictions */}
                <Paper
                  withBorder
                  p="md"
                  radius="md"
                  className="mb-6 bg-gray-50">
                  <Text
                    size="lg"
                    fw={600}
                    className="pb-2 border-b border-gray-200">
                    Event Restrictions
                  </Text>

                  <Box className="py-4">
                    <div className="flex flex-col gap-4">
                      <QuestionRadiobox
                        form={form}
                        formKey="ageRestriction"
                        label="Is there age restriction to this event?"
                      />
                      {form?.values?.ageRestriction === "yes" && (
                        <AgeLimit form={form} />
                      )}
                    </div>
                  </Box>
                </Paper>

                {/* Event Privacy */}
                <Paper
                  withBorder
                  p="md"
                  radius="md"
                  className="mb-6 bg-gray-50">
                  <Text
                    size="lg"
                    fw={600}
                    className="pb-2 border-b border-gray-200">
                    Event Privacy
                  </Text>

                  <Box className="py-4">
                    <QuestionRadiobox
                      form={form}
                      formKey="isPrivate"
                      label="Is this a private event?"
                      type="privacy"
                    />

                    {form?.values?.isFree === "yes" && (
                      <Box className="mt-4">
                        <TextInput
                          label="Maximum Capacity"
                          description="What is the total attendee capacity?"
                          placeholder="Enter capacity"
                          type="number"
                          min="1"
                          withAsterisk
                          {...form.getInputProps("maxCap")}
                        />
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Stack>
            </Stepper.Step>

            {/* Step 3: Submit */}
            <Stepper.Completed>
              <div className="py-6 text-center">
                <Paper
                  withBorder
                  p="md"
                  radius="md"
                  className="mt-6 mb-6 bg-gray-50">
                  <Text size="xl" fw={500}>
                    You are about to submit your event!
                  </Text>
                  <Text className="text-[14px]">
                    Click the <strong>SUBMIT</strong> button to proceed or
                    <strong> BACK</strong> to crosscheck your details again.
                  </Text>

                  <Box className="flex flex-col justify-start items-start gap-2 mt-10">
                    <Box className="flex items-center gap-2">
                      <Checkbox
                        checked={form.values.acceptTerms}
                        onChange={(event) =>
                          form.setFieldValue(
                            "acceptTerms",
                            event.currentTarget.checked
                          )
                        }
                        color="orange"
                      />
                      <Text className="text-[14px]">
                        I agree to{" "}
                        <Link
                          href={"/policies"}
                          className="text-secondary_color">
                          Ogaticket terms & policy{" "}
                        </Link>
                      </Text>
                    </Box>
                  </Box>

                  <Button
                    loading={loader}
                    color="orange"
                    size="md"
                    type="submit"
                    fullWidth
                    variant="filled"
                    className={`font-medium capitalize w-full bg-secondary_color text-white mx-auto mt-6 ${
                      loader ? "pointer-events-none" : ""
                    }`}>
                    Submit
                  </Button>
                </Paper>
              </div>
            </Stepper.Completed>
          </Stepper>

          <Group justify="center" mt={50}>
            {active !== 0 && (
              <Button type="button" variant="default" onClick={prevStep}>
                Back
              </Button>
            )}
            {active !== 2 && (
              <Button
                type="button"
                variant="filled"
                color="orange"
                className="font-medium capitalize bg-secondary_color text-white"
                onClick={nextStep}>
                Next step
              </Button>
            )}
          </Group>
        </form>
      </Box>

      {showDialogue && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {showEventDialogue.success ? "Success" : "Error"}
            </h3>
            <p>{showEventDialogue.message}</p>
            <Button
              onClick={() => {
                if (showEventDialogue.success) {
                  router.push("/profile");
                }
                setShowDialog(false);
              }}
              className="mt-4 bg-secondary_color text-white"
              variant="filled"
              color="orange">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
