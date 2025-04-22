"use client";

import { MdMenu } from "react-icons/md";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import NavDraw from "./NavDraw";
import NavItem from "./NavItem";
import { Box, Button, Flex } from "@mantine/core";
import Login from "../modal/Login";

const Nav = () => {
  const [scrollY, setScrollY] = useState(0);
  const [opened, { open, close }] = useDisclosure(false);
  const [show, { open: oLogin, close: cLogin }] = useDisclosure(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const opacity = Math.min(scrollY / 200, 1);
  const buttonOpacity = Math.min((scrollY - 50) / 150, 1);

  return (
    <>
      <header
        className="fixed top-0 w-full p-4 transition-all duration-300 z-50"
        style={{
          backgroundColor:
            buttonOpacity >= 1
              ? `rgba(75, 85, 99, ${opacity})`
              : `rgba(0, 0, 0, 0.9)`,
        }}
      >
        <nav className="flex justify-between">
          <div id="logo" className="flex items-center gap-10">
            <Link href={"/"}>
              <h1 className="text-3xl font-anton uppercase font-bold">
                <span className="text-primary">AFRO</span> EVENTS MIAMI
              </h1>
            </Link>
            <div className="hidden md:block">
              <NavItem />
            </div>
          </div>

          {!opened && (
            <MdMenu
              size={30}
              onClick={open}
              className="  cursor-pointer md:hidden"
            />
          )}

          <Box className=" gap-4 hidden md:flex">
            <Button
              variant="white"
              bg="dark.7"
              radius={100}
              c="white"
              size="md"
              onClick={oLogin}
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
            >
              Create Event
            </Button>
          </Box>
        </nav>
      </header>
      <NavDraw opened={opened} close={close} openLogin={oLogin} />
      <Login opened={show} close={cLogin} />
    </>
  );
};

export default Nav;
