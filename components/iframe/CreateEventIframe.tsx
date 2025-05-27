"use client";

// import { useEffect } from "react";

export default function CreateEventIframe() {
  return (
    <>
      <iframe
        src={`${process.env.NEXT_PUBLIC_PAGE_BASE_URL}/emb-create`}
        // src={`http://localhost:3001/emb-create`}
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
