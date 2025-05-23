import { Loader } from "@mantine/core";
import React from "react";

export default function Loading() {
  return (
    <div className=" w-full h-full  flex justify-center">
      <Loader color="white" />
    </div>
  );
}
