import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import TempValueProvider from "@/components/utils/contextAPI/TempValueContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "WATAWI",
  description: "WATAWI",
  icons: "/next.svg",
  openGraph: {
    title: "WATAWI",
    description: "WATAWI",
    images: [
      {
        url: "https://static.ogaticket.com/user/b1ba61e9-8148-41b0-bcdf-ec651da9588d.jpg", // Update with your actual image URL
        width: 1200,
        height: 630,
        alt: "WATAWI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WATAWI",
    description: "WATAWI",
    images: [
      "https://static.ogaticket.com/user/b1ba61e9-8148-41b0-bcdf-ec651da9588d.jpg",
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
            {children}
          </MantineProvider>
        </TempValueProvider>
      </body>
    </html>
  );
}
