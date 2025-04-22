"use client";

import { useEffect } from "react";

export default function IframeDisplay({ slug }: { slug: string }) {
  useEffect(() => {
    const handleMessage = (event: {
      origin: string;
      data: { type: string; paymentUrl: string };
    }) => {
      //   if (event.origin !== "https://ogaticket.com") return; // Security check

      if (event.data && event.data.type === "INITIATE_PAYMENT") {
        // Redirect to checkout page or open modal with Stripe
        window.location.href = event?.data?.paymentUrl;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <>
      <iframe
        src={`${process.env.NEXT_PUBLIC_PAGE_BASE_URL}/embeded/${slug}`}
        style={{
          border: "1px solid #bfcbda88",
          borderRadius: "4px",
          width: "100%",
          height: "100%",
        }}
        allowFullScreen
        aria-hidden="false"
        tabIndex={0}
      ></iframe>
    </>
  );
}
