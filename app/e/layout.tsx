import Nav from "@/components/Navigation/Nav";
import { Box } from "@mantine/core";
import { ReactNode } from "react";

export default function ELayout(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <Box  className="w-full overflow-x-hidden">
      <Nav />
      {children}
    </Box>
  );
}
