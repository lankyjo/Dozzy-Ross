import { Box, Button, Flex, Modal, Text } from "@mantine/core";
import { useState } from "react";

import { mutate } from "swr";
import IconFailure from "../icons/IconFailure";
import IconSuccess from "../icons/IconSuccess";
import { deleteFunc } from "../utils/request";
import {
  customErrorFunc,
  customNotification,
} from "../utils/contextAPI/helperFunctions";

export default function ConfirmDeleteModal({
  opened,
  close,
  coupon,
}: {
  opened: boolean;
  coupon: {
    code: string;
    id: string;
    url: string;
  };
  close: () => void;
}) {
  const [spin, setSpin] = useState<boolean>(false);

  async function handleDelete() {
    setSpin(true);

    try {
      const res = await deleteFunc<any>({
        url: `coupon?_id=${coupon?.id}`,
        values: {},
      });

      if (res?.data?.success) {
        customNotification(
          "success",
          res.data.message,
          "primary_color.0",
          <IconSuccess />
        );
        mutate(coupon?.url);
        close();
      } else {
        customNotification(
          "warning",
          res.data.message,
          "orange.8",
          <IconFailure />
        );
      }
    } catch (error) {
      customErrorFunc(error, <IconFailure />);
    } finally {
      setSpin(false);
    }
  }
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        transitionProps={{
          duration: 400,
          timingFunction: "ease",
        }}
        overlayProps={{
          blur: 3,
        }}
        centered>
        <Box>
          <Text
            fz={16}
            ta="center"
            // ff="poppins-medium"
            fw={500}
            c="white"
            mb={3}>
            Are you sure you want to delete this coupon code?
          </Text>
          <Text
            fz={16}
            ta="center"
            // ff="poppins-bold"
            fw={700}
            c="dark.9"
            mb={20}>
            {coupon?.code}
          </Text>
          <Flex gap={20}>
            <Button
              variant="white"
              size="sm"
              radius={100}
              bg="gray.7"
              fullWidth
              c="white"
              // ff="poppins-medium"
              fw={500}
              onClick={close}>
              Cancel
            </Button>
            <Button
              variant="white"
              size="sm"
              radius={100}
              fullWidth
              c="white"
              bg="red.7"
              // ff="poppins-medium"
              fw={500}
              loading={spin}
              loaderProps={{
                color: "white",
              }}
              onClick={handleDelete}>
              Proceed
            </Button>
          </Flex>
        </Box>
      </Modal>
    </>
  );
}
