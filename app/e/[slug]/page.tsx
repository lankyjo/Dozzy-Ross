"use client";
//import IframeDisplay from "@/components/iframe/IframeDisplay";

import SingleEventDetailsPage from "@/components/global/generalSingleEventSlug/SingleEventDetailsPage";

export default function SingleEvent() {
  return (
    <main className="bg-gray-500">
      {/* <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <IframeDisplay slug={slug} />
      </div> */}
      <SingleEventDetailsPage />
    </main>
  );
}
