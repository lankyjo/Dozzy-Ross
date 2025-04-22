// import CreateEventIframe from "@/components/iframe/CreateEventIframe";

import { Flex, Text } from "@mantine/core";

export default async function CreateEvent() {
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
        <Flex h={"100%"} w={"100%"} justify={"center"} align={"center"}>
          <Text>The create event form will be here.</Text>
        </Flex>
        {/* <CreateEventIframe /> */}
      </div>
    </main>
  );
}
