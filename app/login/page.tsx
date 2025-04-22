"use client";

import useAppContext from "@/components/utils/hooks/useAppContext";
import useGetter from "@/components/utils/hooks/useGetter";
// import { postFunc } from "@/components/utils/request";
import { useEffect, useState } from "react";

// import { Box } from "@mantine/core";
// import { ActionIcon, Box, Group } from "@mantine/core";
// import Image from "next/image";
// import Link from "next/link";
// import { FcGoogle } from "react-icons/fc";

const fields = [
  { type: "email", placeholder: "Enter your email", label: "Email Address" },
  { type: "password", placeholder: "Enter your password", label: "Password" },
];

export default function LoginPage() {
  const { organizer, setOrganizer } = useAppContext();
  const { data: user } = useGetter(
    `user/public?usernameSlug=${process.env.NEXT_PUBLIC_USER_NAME}`
  );
  useEffect(() => {
    if (user?.data) {
      setOrganizer(user?.data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.data]);

  const [, setLoginData] = useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // try {
    //   const data = await postFunc({
    //     url: "",
    //     values: {
    //       ...loginData,
    //     },
    //   });
    // } catch (error) {}
    // Handle login logic here
  };

  return (
    <section className="w-full h-dvh lg:p-0 md:p-10 p-5 relative flex justify-center items-center lg:text-gray-900 text-white">
      <div className="bg-white/30 backdrop-blur-xl w-full rounded-lg p-10 lg:p-0 lg:px-10 lg:py-6 lg:overflow-y-auto flex-1/2 space-y-2 flex justify-center items-center flex-col lg:space-y-3 lg:h-full lg:rounded-none lg:bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="space-y-3 w-full max-w-[500px] mx-auto"
        >
          <h1 className="text-3xl uppercase font-anton">Login</h1>
          {fields.map((field) => (
            <InputField
              key={field.placeholder}
              type={field.type}
              placeholder={field.placeholder}
              label={field.label}
              handleChange={handleChange}
              name={field.label.toLowerCase().replace(" ", "")}
            />
          ))}
          <div>
            <button
              type="submit"
              className="w-full cursor-pointer text-white bg-primary py-3 rounded-lg"
            >
              Login
            </button>
          </div>
        </form>
        {/* <Box className=" flex  justify-end  w-full max-w-[500px] ">
          <Link
            href="/verify-email?password=true"
            className="no-underline text-primary  justify-self-end "
          >
            forgot password?
          </Link>
        </Box> */}
        {/* <div>
          <p>
            Don&apos;t have an account?{" "}
            <span className="text-primary">
              <Link href="/register">Register</Link>
            </span>
          </p>
        </div> */}
        {/* <div className="max-w-[500px] text-center my-4 flex items-center w-full justify-center">
          <hr className="w-full border-gray-300 lg:border-gray-400" />
          <span className="mx-2 text-gray-200 lg:text-gray-800">or</span>
          <hr className="w-full border-gray-300 lg:border-gray-400" />
        </div>

        <div className="w-full max-w-[500px]">
          <button className="w-full cursor-pointer py-3 rounded-lg flex items-center gap-2 justify-center border border-white lg:border-gray-500 lg:text-gray-800 text-white">
            <span>
              <FcGoogle />
            </span>
            <span>Sign in with Google</span>
          </button>
        </div> */}
      </div>

      <div
        className="absolute select-none inset-0 -z-[1] lg:relative lg:flex-1/2 lg:h-full"
        style={{
          backgroundImage: `url(${organizer?.imageUrl || "/wizkid.webp"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <video className="w-full h-full object-cover" muted autoPlay loop>
          <source src="/placeholder1.mp4" />
        </video>
        {/* <div className="absolute flex p-4 flex-col justify-start items-end inset-0 bg-black/50 text-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src={"/logo.crop.png"} width={100} height={100} alt="logo" />
          </Link>
        </div> */}
      </div>
    </section>
  );
}

interface InputProps {
  type: string;
  placeholder: string;
  label: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}

const InputField = ({ type, placeholder, label, handleChange }: InputProps) => {
  return (
    <div>
      <label
        className="block text-sm text-white lg:text-gray-600"
        htmlFor={label}
      >
        {label}
      </label>
      <input
        className="border border-white lg:border-gray-500 rounded-md w-full p-2 placeholder:text-xs lg:placeholder:text-gray-500 placeholder:text-gray-200"
        type={type}
        id={label}
        placeholder={placeholder}
        name={label.toLowerCase().replace(" ", "")}
        onChange={handleChange}
        required
        autoComplete="off"
      />
    </div>
  );
};
