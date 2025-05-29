import { Loader } from "@mantine/core";
import React from "react";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  let title = "";
  let description = "";
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ORGANIZER_PLATFORM_FRONTEND_URL}/api/details`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch metadata");
    }

    const data = await res.json();

    title = data?.heroTitle;
    description = data?.heroSubText;

    const url = data?.backgroundImage?.url;

    return {
      title,
      description,
      icons: "/next.ico",
      openGraph: {
        title,
        description,
        images: url
          ? [
              {
                url: url,
                width: 1200,
                height: 630,
                alt: title,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: url || undefined,
      },
    };
  } catch (error) {
    console.error("Metadata generation failed:", error);

    // Return fallback metadata without crashing
    return {
      title,
      description,
      icons: "/next.ico",
      openGraph: {
        title,
        description,
        images: [], // No image fallback
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
    };
  }
}

export default function Loading() {
  return (
    <div className=" w-full h-full  flex justify-center bg-gray-500">
      <Loader color="white" />
    </div>
  );
}
