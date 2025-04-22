import IframeDisplay from "@/components/iframe/IframeDisplay";

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
        }}
      >
        <IframeDisplay slug={slug} />
      </div>
    </main>
  );
}
