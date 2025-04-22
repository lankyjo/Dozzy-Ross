import { Flex, Button, Box, Container, Text } from "@mantine/core";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function TablePagination({
  lastPage,
  currentPage,
  setPage,
  data,
}: {
  lastPage: number;
  currentPage: number;
  setPage: (val: number) => void;
  data: any;
}) {
  function handlePaginate({ key }: { key: string }) {
    const lastPage = data?.meta.lastPage;
    let currentPage = data?.meta.page;

    if (key === "next") {
      if (currentPage < lastPage) {
        const val = ++currentPage;
        setPage(val);
      }
    } else {
      if (currentPage > 1) {
        const val = --currentPage;
        setPage(val);
      }
    }
  }
  return (
    <Container size={800} mt={30}>
      <Flex gap={20} justify="space-between" w="100%" align="center">
        <Button
          variant="outline"
          className=" border border-[white]"
          color="white"
          fz={16}
          fw={500}
          tt="capitalize"
          radius={8}
          onClick={() => handlePaginate({ key: "prev" })}
        >
          <FaArrowLeft /> prev
        </Button>
        <Box>
          <Flex gap={8} align="center">
            <Text className="text-base font-poppins_medium capitalize">
              page
            </Text>
            <Text className="text-base font-poppins_medium ">
              {currentPage}
            </Text>
            <Text className="text-base font-poppins_medium ">of</Text>
            <Text className="text-base font-poppins_medium ">{lastPage}</Text>
          </Flex>
        </Box>
        <Button
          variant="outline"
          className=" border border-[white]"
          color="white"
          fz={16}
          fw={500}
          tt="capitalize"
          radius={8}
          onClick={() => handlePaginate({ key: "next" })}
        >
          next <FaArrowRight />
        </Button>
      </Flex>
    </Container>
  );
}
