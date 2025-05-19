import { Box, Button, Flex, Modal } from "@mantine/core";
import { useState } from "react";
import { logUserOut } from "../utils/contextAPI/helperFunctions";
import classes from "./Login.module.css";
import { useRouter } from "next/navigation";

export default function ConfirmLogout({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) {
  const [loader, setLoader] = useState<boolean>(false);
  const collection = {
    close,
    setLoader,
  };

  const router = useRouter();

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {}}
        withCloseButton={false}
        title="Are you sure you want to LOGOUT?"
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
          blur: 3,
        }}>
        <Box>
          <Flex gap={20}>
            <Button
              variant="white"
              size="sm"
              radius={100}
              bg="gray.7"
              fullWidth
              c="white"
              ff="poppins-medium"
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
              fw={500}
              loading={loader}
              loaderProps={{
                color: "white",
              }}
              onClick={() => {
                logUserOut(collection);

                router.push("/");
              }}>
              Logout
            </Button>
          </Flex>
        </Box>
      </Modal>
    </>
  );
}
