import { Drawer } from "@mantine/core";
import NavItem from "./NavItem";

export default function NavDraw({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
  openLogin: () => void;
}) {
  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        lockScroll={false}
        position="top"
        size="45%"
        styles={{
          body: {
            // backgroundColor: "red",
            backgroundColor: "rgba(75, 85, 99, 1)", // Slight transparency
            paddingTop: "10px",
            // backdropFilter: "blur(1px)",
          },
          overlay: {
            backgroundColor: "transparent", // Slight transparency
          },
          content: {
            backgroundColor: "transparent", // Slight transparency
          },
          header: {
            backgroundColor: "transparent", // Slight transparency
          },
          // close: {
          //   backgroundColor: "black",
          // },
        }}
      >
        <div>
          {/* Drawer content */}
          <NavItem />
          {/* <Stack gap={5} mt={16}>
            <Button
              variant="white"
              bg="dark.7"
              radius={100}
              c="white"
              size="md"
              onClick={openLogin}
            >
              Login
            </Button>
            <Button
              variant="white"
              bg="rgb(239 121 13)"
              radius={100}
              c="white"
              component={Link}
              href="/create"
              size="md"
            >
              Create Event
            </Button>
          </Stack> */}
        </div>
      </Drawer>
    </>
  );
}
