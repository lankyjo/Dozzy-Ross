"use client";

import { MdMenu } from "react-icons/md";

import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import NavDraw from "./NavDraw";
import NavItem from "./NavItem";
import Login from "../modal/Login";
import { Box, Button } from "@mantine/core";
import dynamic from "next/dynamic";
import useGetter from "../utils/hooks/useGetter";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Logo from "../utils/Logo";

const ProfileMenu = dynamic(() => import("../Menu/ProfileMenu"), {
  ssr: false,
  loading: () => (
    <div className="w-[33px] h-[33px] rounded-full bg-gray-700"></div>
  ),
});

const Nav = () => {
  const [scrollY, setScrollY] = useState(0);
  const [opened, { open, close }] = useDisclosure(false);
  const [show, { open: oLogin, close: cLogin }] = useDisclosure(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userImage, setUserImage] = useState("");
  const router = useRouter();
  const { data: user } = useGetter(isAuthenticated ? "user" : null);

  // Check auth token on component mount and whenever cookies change
  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("access_token");
      setIsAuthenticated(!!token);
    };

    // Initial check
    checkAuth();

    // Setup a listener to detect cookie changes
    const intervalId = setInterval(checkAuth, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Handle user data effect
  useEffect(() => {
    if (user?.data?.imageUrl) {
      setUserImage(user.data.imageUrl);
    }
  }, [user]);

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
            <Logo />
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

          <Box className=" gap-4 hidden md:flex  md:items-center">
            {/* Authentication section that updates reactively */}
            <div className="auth-section">
              {isAuthenticated ? (
                <ProfileMenu image={userImage} />
              ) : (
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
              )}
            </div>

            <Button
              variant="white"
              bg="rgb(239 121 13)"
              radius={100}
              c="white"
              onClick={() => {
                if (!isAuthenticated) {
                  localStorage.setItem("link", "/create");
                  oLogin();
                } else {
                  router.push("/create");
                }
              }}
            >
              Create Event
            </Button>
          </Box>
        </nav>
      </header>
      <NavDraw
        opened={opened}
        close={close}
        openLogin={oLogin}
        isAuthenticated={isAuthenticated}
      />
      <Login opened={show} close={cLogin} />
    </>
  );
};

export default Nav;
