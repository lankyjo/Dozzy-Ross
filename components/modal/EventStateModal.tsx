import { Box, Button, Flex, Modal } from "@mantine/core";
import classes from "./Login.module.css";

type EventSTateProps = {
  message: string;
  close: () => void;
  opened: boolean;
};
export default function EventStateModal({
  message,
  opened,
  close,
}: EventSTateProps) {
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={true}
        title="Notice"
        centered
        transitionProps={{
          duration: 400,
          timingFunction: "ease",
        }}
        classNames={{
          title: classes.title,
          header: classes.body,
          body: classes.body,
        }}
        overlayProps={{
          blur: 1,
        }}>
        <Box>
          <p className=" text-black">{message}</p>
          <Flex gap={20} mt={10}>
            <Button
              variant="white"
              size="sm"
              radius={100}
              bg="gray.7"
              fullWidth
              c="white"
              fw={500}
              onClick={close}>
              Close
            </Button>
          </Flex>
        </Box>
      </Modal>
    </>
  );
}
