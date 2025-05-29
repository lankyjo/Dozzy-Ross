"use client";

import { Button, Divider, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconExclamationMark } from "@tabler/icons-react";
import { useState } from "react";
import Cookies from "js-cookie";

export const ConfirmModal = ({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action: string;
}): Promise<boolean> => {
  return new Promise((resolve) => {
    modals.openConfirmModal({
      title,
      centered: true,
      children: <p>{message}</p>,
      labels: {
        confirm: (
          <Text
            maw={100}
            variant=""
            className="capitalize text-white font-poppins-medium font-medium rounded-md"
          >
            {action}
          </Text>
        ),
        cancel: (
          <Text
            maw={100}
            variant="outline"
            className="capitalize text-secondary_color border-secondary_color font-poppins-medium font-medium rounded-md"
          >
            No
          </Text>
        ),
      },
      confirmProps: { color: "orange" },
      cancelProps: {},
      onCancel: () => resolve(false),
      onConfirm: () => resolve(true),
    });
  });
};

const ConfirmModalContent = ({ onClose }: { onClose: () => void }) => {
  const [showMessage, setShowMessage] = useState(false);
  const handleYes = () => {
    setShowMessage(true);
  };

  return (
    <div style={{ zIndex: 999 }}>
      {showMessage ? (
        <div className="bg-[#4D5057] py-8 px-4 rounded-xl">
          <Text className="text-white font-semibold text-2xl text-center mb-3">
            Caution!!
          </Text>
          <Text className="text-white text-base text-center">
            If this wasn&#39;t you, we recommend you change your password and
            log in again.
          </Text>
          <Divider color="white" my={20} />
          <Button
            variant="white"
            fullWidth
            maw={100}
            fz={16}
            size="md"
            radius={100}
            c="dark.8"
            onClick={onClose}
            className="font-medium font-poppins-medium mx-auto"
          >
            Ok
          </Button>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-xl">
          <div className="flex flex-col justify-center items-center gap-2 my-4">
            <span className="text-center rounded-full p-2 bg-slate-100">
              <IconExclamationMark
                color="red"
                className="font-bold"
                size={50}
              />
            </span>
            <Text
              c={"#171717"}
              fw={"bold"}
              className="text-secondary_color font-semibold text-2xl text-center"
            >
              Notice
            </Text>
            <Text
              c={"#171717"}
              className="text-[#4D5057] text-base text-center"
            >
              Your account has been logged-in on another device
            </Text>
          </div>
          <div className="flex gap-4 mt-3">
            <Button
              variant="white"
              size="md"
              radius={100}
              bg="rgb(239 121 13)"
              c={"white"}
              fullWidth
              fz={12}
              className="font-medium font-poppins-medium bg-secondary_color text-white"
              onClick={onClose}
            >
              Yes, that was me
            </Button>
            <Button
              variant="outline"
              fullWidth
              fz={12}
              size="md"
              color="#EF790D"
              radius={100}
              c={"#EF790D"}
              onClick={() => handleYes()}
              className="font-medium font-poppins-medium border-[#EF790D]"
            >
              That wasn&#39;t me
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export const AuthConfirmModal = (): Promise<boolean> => {
  return new Promise((resolve) => {
    modals.open({
      trapFocus: false,
      withCloseButton: false,
      closeOnClickOutside: false,
      styles: {
        content: {
          backgroundColor: "transparent",
          paddingTop: "10px",
          paddingBottom: "10px",
          zIndex: 999,
        },
      },
      transitionProps: {
        duration: 400,
        timingFunction: "ease",
        transition: "slide-up",
      },
      overlayProps: {
        blur: 0,
      },
      centered: true,
      children: (
        <ConfirmModalContent
          onClose={() => {
            Cookies.remove("access_token");
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
            resolve(false);
            modals.closeAll();
          }}
        />
      ),
    });
  });
};
