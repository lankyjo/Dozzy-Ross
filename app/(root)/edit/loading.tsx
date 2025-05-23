import { Loader } from "@mantine/core";
import React from "react";

export default function Loading() {
  return (
    <div className=" w-full flex justify-center h-[80vh] items-center">
      <Loader color="white" />
    </div>
  );
}
