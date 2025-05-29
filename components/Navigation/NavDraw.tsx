import { Button, Drawer, Stack } from "@mantine/core";
import NavItem from "./NavItem";
import Link from "next/link";
import ConfirmLogout from "../modal/ConfirmLogout";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";

export default function NavDraw({
  opened,
  close,
  openLogin,
  isAuthenticated,
}: {
  opened: boolean;
  close: () => void;
  openLogin: () => void;
  isAuthenticated: boolean;
}) {
  const [openedLogout, { open: openLogout, close: closed }] =
    useDisclosure(false);
  const router = useRouter();

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
          close: {
            backgroundColor: "black",
          },
        }}
      >
        <div>
          {/* Drawer content */}
          <NavItem close={close} />

          {isAuthenticated && (
            <ul className="gap-4 mt-3 flex flex-col md:flex-row md:gap-10">
              <li className="font-semibold uppercase">
                <Link href={"/profile"} onClick={close}>
                  profile
                </Link>
              </li>
            </ul>
          )}
          <Stack gap={5} mt={16}>
            {isAuthenticated ? (
              <Button
                variant="white"
                bg="dark.7"
                radius={100}
                c="white"
                size="md"
                onClick={() => {
                  openLogout();
                  close();
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="white"
                bg="dark.7"
                radius={100}
                c="white"
                size="md"
                onClick={() => {
                  openLogin();
                  close();
                }}
              >
                Login
              </Button>
            )}
            <Button
              variant="white"
              bg="rgb(239 121 13)"
              radius={100}
              c="white"
              onClick={() => {
                close();
                if (!isAuthenticated) {
                  localStorage.setItem("link", "/create");
                  openLogin();
                } else {
                  router.push("/create");
                }
              }}
              size="md"
            >
              Create Event
            </Button>
          </Stack>
        </div>
      </Drawer>
      <ConfirmLogout close={closed} opened={openedLogout} />
    </>
  );
}
