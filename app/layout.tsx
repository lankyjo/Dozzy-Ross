import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import TempValueProvider from "@/components/utils/contextAPI/TempValueContext";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "mantine-datatable/styles.layer.css";
import { ModalsProvider } from "@mantine/modals";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/yesiamrocks/cssanimation.io@1.0.3/cssanimation.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.variable}>
        <TempValueProvider>
          <MantineProvider defaultColorScheme="auto">
            <ModalsProvider>
              <Notifications position="top-right" />
              {children}
            </ModalsProvider>
          </MantineProvider>
        </TempValueProvider>
      </body>
    </html>
  );
}
