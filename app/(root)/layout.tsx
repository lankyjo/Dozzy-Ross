import Nav from "@/components/Navigation/Nav";
import { Box } from "@mantine/core";
import { ReactNode } from "react";

export default function CustomRootLayout(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <Box w="100%">
      <Nav />
      {children}
    </Box>
  );
}
