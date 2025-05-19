"use client";
import React from "react";
import EventOverviewTabs from "@/components/settings/EventOverviewTabs";

export default function page() {
  return (
    <div className="w-full flex-1 max-w-[1272px] mx-auto px-5 mt-[10px]">
      <EventOverviewTabs />
    </div>
  );
}
