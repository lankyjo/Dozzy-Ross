"use client";
import { Button, Modal, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import classes from "./Login.module.css";
import { useState, useEffect } from "react";
import { postFunc } from "../utils/request";
import {
  customErrorFunc,
  customNotification,
} from "../utils/contextAPI/helperFunctions";
import { IconCheck } from "@tabler/icons-react";
import Cookies from "js-cookie";
import { mutate } from "swr";
import { useRouter } from "next/navigation";

type Props = {
  opened: boolean;
  close: () => void;
};

type FormProps = {
  email: string;
  password: string;
};
export default function Login(props: Props) {
  const { opened, close } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [storedOrganizerId, setStoredOrganizerId] = useState<string | null>(
    null
  );
  const [savedLink, setSavedLink] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Access localStorage only on the client side
    setStoredOrganizerId(localStorage.getItem("organizer_id"));
    setSavedLink(localStorage.getItem("link"));
  }, []);

  const login = useForm<FormProps>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.trim().length > 0 ? null : "Password cannot be empty",
    },
    validateInputOnChange: ["email"],
  });

  async function handleSubmit({ values }: { values: FormProps }) {
    try {
      setIsLoading(true);
      const data = await postFunc({
        values,
        url: "auth/login",
      });

      // Store the token in a cookie
      Cookies.set("access_token", data?.data?.data?.accessToken);

      // Store the user ID in localStorage for authorization checks
      // Log for debugging
      if (data?.data?.data?._id) {
        const userId = data.data.data._id;

        // Compare with allowed user ID if available
        if (storedOrganizerId && userId !== storedOrganizerId) {
          Cookies.remove("access_token");
          // Add this explicit check to immediately show the unauthorized moda
          customNotification(
            "Unauthorized",
            "You are not authorized to access this site",
            "red"
          );
          setIsLoading(false);

          return;
        }
      }

      mutate("user");

      customNotification(
        "Notification",
        data?.data?.message,
        "",
        <IconCheck size={20} />
      );

      login.reset();
      if (savedLink) {
        localStorage.removeItem("link");
        router.push(savedLink);
      }
      close();
    } catch (error) {
      console.log(error);

      customErrorFunc(error);
    }

    setIsLoading(false);
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Login"
        centered
        classNames={{
          title: classes.title,
          header: classes.body,
          body: classes.body,
        }}
      >
        <form onSubmit={login.onSubmit((values) => handleSubmit({ values }))}>
          <Stack gap="lg">
            <TextInput
              withAsterisk
              label="Email"
              disabled={isLoading}
              placeholder="your@email.com"
              key={login.key("email")}
              {...login.getInputProps("email")}
              classNames={{
                label: classes.label,
                input: classes.input,
              }}
            />
            <PasswordInput
              withAsterisk
              label="Password"
              disabled={isLoading}
              placeholder="Enter your password"
              key={login.key("password")}
              {...login.getInputProps("password")}
              classNames={{
                label: classes.label,
                input: classes.input,
              }}
            />

            <Button
              type="submit"
              variant="white"
              bg="#171717"
              c="white"
              loading={isLoading}
              loaderProps={{
                color: "white",
              }}
            >
              Login
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
