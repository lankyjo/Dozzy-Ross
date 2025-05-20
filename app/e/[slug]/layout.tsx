import { Box } from "@mantine/core";
import { ReactNode } from "react";
import type { Metadata } from "next";

type Props = {
  params: Promise<Params>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;

    console.log(await params);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}event/single?slug=${slug}`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch metadata. Status: ${res.status}`);
    }

    const data = await res.json();

    const title = data.data.title;
    const description = data.data.description;
    const url = data.data.banner.url;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: url,
      },
    };
  } catch (error) {
    console.error("Metadata generation failed:", error);

    return {
      title: "Event Not Found",
      description: "We couldn’t find the event you were looking for.",
    };
  }
}

type Params = { slug: string };
export default async function ELayout(props: { children: ReactNode }) {
  const { children } = props;
  return <Box className="w-full overflow-x-hidden">{children}</Box>;
}
