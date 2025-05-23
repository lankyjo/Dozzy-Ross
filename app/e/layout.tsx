import Nav from "@/components/Navigation/Nav";
import { Box } from "@mantine/core";
import { ReactNode, Suspense } from "react";

export default function ELayout(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <Box className="w-full overflow-x-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <Nav />
      </Suspense>
      {children}
    </Box>
  );
}
