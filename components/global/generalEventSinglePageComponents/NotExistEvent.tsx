import { Paper, Flex, Button, Text } from "@mantine/core";
import Link from "next/link";

export default function NotExistEvent() {
  return (
    <Paper shadow="xl" p="xl" withBorder mx="auto" w="100%" maw={700}>
      <Text
        ff="poppins-bold"
        tt="uppercase"
        fw={700}
        ta="center"
        fz={24}
        mb={20}
        c={"#171717"}>
        oops!
      </Text>
      <Text
        c={"#171717"}
        ta="center"
        fz={16}
        ff="poppins-regular"
        maw={600}
        mx="auto">
        Sorry, the event title you have provided or entered does not exist.
        Kindly check your spelling and punctuation to ensure it is correct.
      </Text>
      <Text
        my={10}
        ta="center"
        fz={16}
        ff="poppins-regular"
        maw={300}
        mx="auto"
        c={"#171717"}>
        You can visit the home page for a display of all Events. Click the
        button below.
      </Text>
      <Flex justify="center" mt={20}>
        <Button
          fz={15}
          fw={500}
          variant="white"
          bg="#171717"
          c="white"
          radius={5}
          ff="poppins-medium"
          fullWidth
          maw={250}
          size="lg"
          component={Link}
          href="/">
          Go to home
        </Button>
      </Flex>
    </Paper>
  );
}
