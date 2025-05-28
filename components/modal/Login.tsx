"use client";
import { Button, Modal, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import classes from "./Login.module.css";
import { useState } from "react";
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
  const router = useRouter();
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
    const link = localStorage.getItem("link");
    try {
      setIsLoading(true);
      const data = await postFunc({
        values,
        url: "auth/login",
      });

      Cookies.set("access_token", data?.data?.data?.accessToken);

      mutate("user");

      customNotification(
        "Notification",
        data?.data?.message,
        "",
        <IconCheck size={20} />
      );

      login.reset();
      if (link) {
        localStorage.removeItem("link");
        router.push(link);
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
