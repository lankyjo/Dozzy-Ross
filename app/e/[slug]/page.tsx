import IframeDisplay from "@/components/iframe/IframeDisplay";

import type { Metadata } from "next";

type Props = {
  params: Promise<Params>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}event/single?slug=${slug}`
  );
  const data = await res.json();

  const title = data.data.title;
  const description = data.data.description;
  const url = data.data.banner.url;

  return {
    title: title,
    description: description,
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
}

type Params = { slug: string };

export default async function SingleEvent({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  return (
    <main className=" bg-white">
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
        }}>
        <IframeDisplay slug={slug} />
      </div>
    </main>
  );
}
