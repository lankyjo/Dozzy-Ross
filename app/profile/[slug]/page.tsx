"use client";
import React from "react";
import EventOverviewTabs from "@/components/settings/EventOverviewTabs";
import { Paper } from "@mantine/core";

export default function page() {
  return (
    <Paper withBorder p="md" radius="md" className="mt-6 mb-6 ">
      <div className="w-full flex-1 max-w-[1272px] mx-auto md:px-5 mt-[100px] ">
        <EventOverviewTabs />
      </div>
    </Paper>
  );
}
