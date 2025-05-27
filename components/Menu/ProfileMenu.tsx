"use client";

import { Menu, Avatar } from "@mantine/core";
import { IconUser, IconLogout } from "@tabler/icons-react";
import ConfirmLogout from "../modal/ConfirmLogout";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import Link from "next/link";

export default function ProfileMenu({ image }: { image: string }) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        {image ? (
          <div className="  ">
            <Image
              src={image}
              alt="profile"
              width={25}
              height={25}
              className="rounded-full object-cover  cursor-pointer w-[25px] h-[25px]"
            />
          </div>
        ) : (
          <Avatar
            variant="filled"
            radius="xl"
            size={33}
            className=" cursor-pointer"
            component="button"
          />
        )}
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconUser size={14} />}>
          <Link href={"/profile"}>Profile</Link>{" "}
        </Menu.Item>
        <Menu.Item leftSection={<IconLogout size={14} />} onClick={open}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>

      <ConfirmLogout close={close} opened={opened} />
    </Menu>
  );
}
