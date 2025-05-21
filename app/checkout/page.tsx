"use client";

import WishLists from "@/components/WishLists";
import { Container } from "@mantine/core";

export default function Checkout() {
  return (
    <div>
      <Container size={1100} px={10} pt={70} pb={40}>
        <WishLists />
      </Container>
    </div>
  );
}
