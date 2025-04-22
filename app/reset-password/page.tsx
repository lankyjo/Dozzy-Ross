"use client";
import { PasswordInput } from "@mantine/core";

export default function ResetPassword() {
  return (
    <section className="w-full h-dvh lg:p-0 md:p-10 p-5 relative flex justify-center items-center lg:text-gray-900 text-white">
      <div className="bg-white/30 backdrop-blur-xl w-full rounded-lg p-10 lg:p-0 lg:px-10 lg:py-6 lg:overflow-y-auto flex-1/2 space-y-2 flex justify-center items-center flex-col lg:space-y-3 lg:h-full lg:rounded-none lg:bg-white/90">
        <div className="w-full max-w-[500px] mx-auto ">
          <PasswordInput
            mb={15}
            size="md"
            label="New password"
            placeholder="*****************"
            radius={8}
            styles={() => ({
              input: {
                borderColor: "black",
                marginTop: 4,
                "&:focus-within": {
                  borderColor: "black",
                },
                backgroundColor: "transparent",
                color: "black",
                fontFamily: "poppins-regular",
              },
              innerInput: {
                fontFamily: "poppins-regular",
                fontSize: 16,
              },
              label: {
                // fontFamily: "poppins-regular",
                fontSize: 16,
                color: "black",
              },
            })}
            // {...form.getInputProps("password")}
          />
          <PasswordInput
            mb={32}
            size="md"
            label="Confirm password"
            placeholder="*****************"
            radius={8}
            styles={() => ({
              input: {
                borderColor: "black",
                marginTop: 4,
                "&:focus-within": {
                  borderColor: "black",
                },
                backgroundColor: "transparent",
                color: "black",
              },
              innerInput: {
                fontFamily: "poppins-regular",
                fontSize: 14,
              },

              label: {
                // fontFamily: "poppins-regular",
                fontSize: 14,
                color: "black",
              },
            })}
            // {...form.getInputProps("confirmPassword")}
          />

          <div className=" mt-10">
            <button className="w-full cursor-pointer text-white bg-primary py-3 rounded-lg">
              Continue
            </button>
          </div>
        </div>
      </div>

      <div className="absolute select-none inset-0 -z-[1] lg:relative lg:flex-1/2 lg:h-full">
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
