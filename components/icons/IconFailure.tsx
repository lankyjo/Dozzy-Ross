import dynamic from "next/dynamic";

// Dynamically import components
const Icon = dynamic(
  () => import("./AnimationIcons").then((mod) => mod.IconF),
  {
    ssr: false, // Disable server-side rendering
  }
);

export default function IconFailure({ width }: { width?: number }) {
  return (
    <div>
      <Icon width={width} />
    </div>
  );
}
