"use client";
import IframeDisplay from "@/components/iframe/IframeDisplay";

import type { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}event/single?slug=${slug}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch event data");
    }

    const data = await res.json();

    if (!data?.data) {
      // Handle case when data is not available
      return {
        title: "Event Details",
        description: "View event details",
      };
    }

    const title = data.data.title || "Event Details";
    const description = data.data.description || "View event details";
    const url = data.data.banner?.url || "";

    return {
      title: title,
      description: description,
      openGraph: {
        title,
        description,
        images: url
          ? [
              {
                url,
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
    console.error("Error generating metadata:", error);
    return {
      title: "Event Details",
      description: "View event details",
    };
  }
}

export default function SingleEvent({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return (
    <main className=" bg-white">
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <IframeDisplay slug={slug} />
      </div>
    </main>
  );
}
