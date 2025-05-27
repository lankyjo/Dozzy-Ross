import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  // FaFacebook,
  // FaInstagram,
  // FaTwitter,
  // FaYoutube,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import Logo from "../utils/Logo";

const Footer = () => {
  const [userVariables, setUserVariables] = useState<any>(null);
  useEffect(() => {
    const getUserVariables = async () => {
      const res = await fetch("/api/details");
      const variableVals = await res.json();
      setUserVariables(variableVals);
    };

    getUserVariables();
  }, []);

  return (
    <footer
      id="contact"
      className="padding text-white md:space-y-20 space-y-16"
    >
      <div className="grid  grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div id="logo" className="space-y-5">
          <Logo />
          <p>{userVariables?.footerDetails?.footerText}</p>
        </div>

        <div className="flex md:justify-center max-md:gap-20 gap-10">
          <div className="space-y-5">
            <h2 className="font-bold uppercase font-anton">Quick Links</h2>
            <ul className="flex flex-col gap-2">
              <li className=" capitalize">
                <Link href={`/e`}>Events</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex md:justify-end" id="contact">
          <div className="space-y-5 lg:col-span-1 md:col-span-2">
            <h2 className="text-3xl uppercase font-bold font-anton">Contact</h2>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-primary" />
              <Link
                href={`mailto:${userVariables?.footerDetails?.footerEmail}`}
              >
                {userVariables?.footerDetails?.footerEmail}
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <FaPhone className="text-primary" />
              <Link href={`tel:${userVariables?.footerDetails?.footerPhone}`}>
                {userVariables?.footerDetails?.footerPhone}
              </Link>
            </div>
          </div>
        </div>
        <div className="flex md:justify-end">
          <div className="space-y-5 lg:col-span-1 md:col-span-2">
            <h2 className="font-bold uppercase font-anton">Powered by:</h2>
            <div>
              <Link href="https://www.ogaticket.com" target="_blank">
                <Image
                  src={"/logo.crop.png"}
                  width={70}
                  height={70}
                  alt="ogaticket logo"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex justify-between max-md:flex-col gap-10 items-center rounded-2xl py-8 px-4 bg-gray-400/20">
        <small>© 2025 powered by ogaticket</small>
        <div className="flex gap-2">
          <span className="p-3 rounded-full bg-gray-400/80">
            <a href="https://www.instagram.com/ogaticket_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">
              <FaInstagram className="text-black" />
            </a>
          </span>
          <span className="p-3 rounded-full bg-gray-400/80">
            <a href="https://twitter.com/Ogaticket_">
              <FaTwitter className="text-black" />
            </a>
          </span>
          <span className="p-3 rounded-full bg-gray-400/80">
            <a href="https://www.facebook.com/share/1FEr4akUw6/">
              <FaFacebook className="text-black" />
            </a>
          </span>

          <span className="p-3 rounded-full bg-gray-400/80">
            <a href="https://www.youtube.com/@Ogaticket">
              <FaYoutube className="text-black" />
            </a>
          </span>
        </div>
      </div> */}
    </footer>
  );
};

export default Footer;
