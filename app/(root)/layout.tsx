import Nav from "@/components/Navigation/Nav";
import { Box } from "@mantine/core";
import { ReactNode } from "react";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "AFRO EVENTS MIAMI";
  const description =
    "The Energy Hits Different, Bringing all the Good vibes and sounds from the continent of Africa & Caribbean. Music by the hottest DJs and Artists from EVERY culture Playing the best of #Afrobeat #Amapiano #Dancehall #Reggae #Soca #Kompa ";

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}user/public?usernameSlug=${process.env.NEXT_PUBLIC_USER_NAME}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch metadata");
    }

    const data = await res.json();
    const url = data?.data?.imageUrl;

    return {
      title,
      description,
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
    console.error("Metadata generation failed:", error);

    // Return fallback metadata without crashing
    return {
      title,
      description,
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

export default function CustomRootLayout(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <Box w="100%">
      <Nav />
      {children}
    </Box>
  );
}
