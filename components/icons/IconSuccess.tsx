import dynamic from "next/dynamic";

// Dynamically import components
const Icon = dynamic(
  () => import("./AnimationIcons").then((mod) => mod.IconS),
  {
    ssr: false, // Disable server-side rendering
  }
);

export default function IconSuccess({ width }: { width?: number }) {
  return (
    <div>
      <Icon width={width} />
    </div>
  );
}
