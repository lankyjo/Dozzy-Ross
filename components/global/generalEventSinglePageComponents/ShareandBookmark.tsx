import {
  ActionIcon,
  Box,
  Button,
  CopyButton,
  Modal,
  Popover,
  Text,
  Tooltip,
} from "@mantine/core";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";

import { IconDownload } from "@tabler/icons-react";
import WhatsappIcon from "@/components/icons/WhatsappIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import TwitterIcon from "@/components/icons/TwitterIcon";
// import { Popover, Text, Button } from "@mantine/core";

function ShareandBookmark({
  qrcode,
  shareLink,
  title,
  socials,
  event,
}: {
  qrcode: string;
  shareLink: string;
  title: string;
  socials: [];
  event?: SingleEventProps;
  size?: number;
}) {
  const [shareShow, setShareShow] = useState<boolean>(false);
  const [opened, { close, open }] = useDisclosure(false);

  const formatDate = (date: string | undefined) =>
    new Date(date ?? "").toISOString().replace(/-|:|\.\d{3}/g, "");

  const createGoogleCalendarLink = (event: {
    title: string;
    location: string;
    description: string;
    start?: string;
    end?: string;
  }) => {
    const { title, location, description, start, end } = event;

    const baseUrl = "https://calendar.google.com/calendar/r/eventedit";
    const params = new URLSearchParams({
      text: title,
      location: location,
      details: description,
      dates: `${formatDate(start)}/${formatDate(end)}`,
    });

    // return `${baseUrl}?${params.toString()}`;

    return window.open(`${baseUrl}?${params.toString()}`, "_blank");
  };

  return (
    <Box className="flex ml-auto  justify-between items-center mr-[20px] cursor-pointer gap-5 md:gap-10">
      <ModalComp
        open={shareShow}
        close={setShareShow}
        qrcode={qrcode}
        shareLink={shareLink}
        title={title}
        socials={socials}
        event={event}
      />
      <Box onClick={() => setShareShow(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={30}
          height={30}
          viewBox="0 0 32 32"
          fill="none">
          <path
            d="M18.6042 6.88672V12.0951C9.48958 13.3971 5.58333 19.9076 4.28125 26.418C7.53646 
            21.8607 12.0938 19.7773 18.6042 19.7773V25.1159L27.7188 16.0013L18.6042 6.88672ZM21.2083
             13.1758L24.0339 16.0013L21.2083 18.8268V17.1732H18.6042C15.9089 17.1732 13.487 17.668 11.2344 
             18.4102C13.0573 16.6003 15.401 15.181 18.9688 14.6992L21.2083 14.3477V13.1758Z"
            fill="#48525F"
          />
        </svg>
      </Box>

      <Popover
        width={140}
        withArrow
        shadow="md"
        position="top-end"
        opened={opened}>
        <Popover.Target>
          <Box
            onMouseEnter={open}
            onMouseLeave={close}
            onClick={() =>
              createGoogleCalendarLink({
                title: event?.event_title || "",
                location: event?.venue.venue || "",
                description: event?.description || "",
                start: event?.startDate || "",
                end: event?.endDate || "",
              })
            }>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="#2B3865"
                strokeWidth="2"
              />
              <path
                d="M9.5 9.5L12.9999 12.9996M16 8L11 13"
                stroke="#2B3865"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </Box>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="sm">Add to calender</Text>
          {/* <Popover.Target></Popover.Target> */}
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
}

function ModalComp({
  open,
  close,
  title,
  qrcode,
  shareLink,
  event,
}: {
  open: boolean;
  close: Dispatch<SetStateAction<boolean>>;
  qrcode: string;
  shareLink: string;
  title: string;
  socials: [];
  event?: SingleEventProps;
}) {
  const [, setQrcodeImage] = useState<string>(qrcode);

  useEffect(() => {
    setQrcodeImage(qrcode);
  }, [qrcode]);

  function share(url: string, link: string) {
    let message = "";

    if (
      event?.category?.name?.toLocaleLowerCase() ===
      "Love & romance"?.toLowerCase()
    ) {
      message = `
Hello,

You're invited to ${event?.event_title}, by ${event?.groomName} and ${event?.brideName}.
We look forward to seeing you!

Reserve your seat here:
${link}`;
    } else if (
      event?.category?.name?.toLocaleLowerCase() ===
      "Sports & game"?.toLowerCase()
    ) {
      message = `
Hello,

You're invited to ${event?.event_title}, between ${event?.teamOne} and ${event?.teamTwo}.
We look forward to seeing you!

Reserve your seat here:
${link}`;
    } else {
      message = `
Hello,

You're invited to ${event?.event_title}, by ${event?.organizer?.username}.
We look forward to seeing you!

Reserve your seat here:
${link}`;
    }

    window.open(`${url}&text=${message}`, "_blank");
  }

  function downloadImage(imageUrl: string, filename = "ogaticket") {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const eventUrl = `${process.env.NEXT_PUBLIC_ORGANIZER_PLATFORM_FRONTEND_URL}/${shareLink}`;

  return (
    <Modal
      withCloseButton={true}
      centered
      title={"Share Event"}
      opened={open}
      styles={{
        title: {
          color: "#171717",
          fontWeight: 500,
        },
        header: {
          backgroundColor: "white",
        },

        body: {
          backgroundColor: "white",
        },
      }}
      onClose={() => {
        close(false);
      }}
      transitionProps={{
        duration: 300,
        timingFunction: "ease",
      }}
      overlayProps={{
        blur: 4,
        opacity: 0.6,
      }}
      size="md"
      radius="md"
      className="relative">
      <div className="px-2">
        <div className="space-y-6">
          {/* URL Copy Section */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-sm font-poppins-regular break-all text-[#171717]">
                {eventUrl}
              </p>
            </div>
            <CopyButton value={eventUrl}>
              {({ copied, copy }) => (
                <Button
                  onClick={copy}
                  variant="filled"
                  bg={"#EF790D"}
                  className="bg-secondary_color hover:bg-secondary_color/90 text-white font-poppins-medium px-6">
                  {copied ? "Copied!" : "Copy"}
                </Button>
              )}
            </CopyButton>
          </div>

          {/* Social Share Section */}
          <div>
            <p className="text-sm text-[#171717] mb-4 font-poppins-medium">
              Share via
            </p>
            <div className="flex justify-center gap-6 bg-[white]">
              <IconButton
                icon={<WhatsappIcon />}
                onClick={() =>
                  share(
                    `https://api.whatsapp.com/send?url=${eventUrl}`,
                    eventUrl
                  )
                }
                tooltip="Share on WhatsApp"
              />
              <IconButton
                icon={<FacebookIcon />}
                onClick={() =>
                  share(
                    `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`,
                    eventUrl
                  )
                }
                tooltip="Share on Facebook"
              />
              <IconButton
                icon={<TwitterIcon />}
                onClick={() =>
                  share(
                    `https://twitter.com/intent/tweet?url=${eventUrl}`,
                    eventUrl
                  )
                }
                tooltip="Share on Twitter"
              />
            </div>
          </div>

          {/* QR Code Section */}
          <div className="pt-4 border-t">
            <p className="text-sm text-[#171717] mb-4 font-poppins-medium">
              Event QR Code
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Image
                  src={qrcode}
                  alt="Event QR Code"
                  width={140}
                  height={140}
                  className="rounded"
                />
              </div>
              <Button
                variant="subtle"
                bg={"#171717"}
                c={"white"}
                leftSection={<IconDownload size={16} />}
                onClick={() => downloadImage(qrcode, title)}
                className="text-secondary_color font-poppins-medium">
                Download QR Code
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

interface IconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  tooltip: string;
}

function IconButton({ icon, onClick, tooltip }: IconButtonProps) {
  return (
    <Tooltip label={tooltip} position="top">
      <ActionIcon
        onClick={onClick}
        bg={"white"}
        className="w-10 h-10 hover:bg-gray-100 rounded-full transition-colors duration-200">
        {icon}
      </ActionIcon>
    </Tooltip>
  );
}

export default ShareandBookmark;
