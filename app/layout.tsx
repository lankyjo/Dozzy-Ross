import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import TempValueProvider from "@/components/utils/contextAPI/TempValueContext";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "mantine-datatable/styles.layer.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AFRO EVENTS MIAMI",
  description: "AFRO EVENTS MIAMI",
  icons: "/next.svg",
  openGraph: {
    title: "AFRO EVENTS MIAMI",
    description: "AFRO EVENTS MIAMI",
    images: [
      {
        url: "https://res.cloudinary.com/isreal/image/upload/v1745299617/Afrobeat%20miami/afro_events_miami_g56phy.jpg", // Update with your actual image URL
        width: 1200,
        height: 630,
        alt: "AFRO EVENTS MIAMI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AFRO EVENTS MIAMI",
    description: "AFRO EVENTS MIAMI",
    images: [
      "https://res.cloudinary.com/isreal/image/upload/v1745299617/Afrobeat%20miami/afro_events_miami_g56phy.jpg",
    ], // Same as Open Graph image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <TempValueProvider>
          <MantineProvider defaultColorScheme="auto">
            <Notifications position="top-right" />
            {children}
          </MantineProvider>
        </TempValueProvider>
      </body>
    </html>
  );
}
