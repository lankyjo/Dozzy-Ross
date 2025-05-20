import { Box, Button, Modal, Text, Textarea } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

export default function EmbededCode({
  embedModalOpen,
  setEmbedModalOpen,
  slug,
}: {
  embedModalOpen: boolean;
  setEmbedModalOpen: (value: boolean) => void;
  slug: string;
}) {
  return (
    <>
      <Button
        fz={{ base: 12, sm: 14 }}
        fw={500}
        bg="#171717"
        c="white"
        color="primary_color.0"
        onClick={() => setEmbedModalOpen(true)}
        className="font-poppins-regular  bg-[#1e1e1e00] text-primary_color hover:bg-[#1e1e1e00] hover:text-secondary_color  px-0  flex items-end justify-end">
        Embed Code
      </Button>

      <Modal
        opened={embedModalOpen}
        onClose={() => setEmbedModalOpen(false)}
        title="Embed Event"
        centered
        styles={{
          header: {
            backgroundColor: "#1e1e1e",
            color: "#fff",
            borderBottom: "1px solid #333",
          },
          content: {
            backgroundColor: "#1e1e1e",
            padding: 0,
          },
          body: {
            backgroundColor: "#1e1e1e",
            padding: 0,
          },
          inner: {
            backgroundColor: "transparent",
            padding: 0,
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(2px)",
          },
        }}
        size="lg">
        <Box p={16} style={{ backgroundColor: "#1e1e1e" }}>
          <Text className="text-[13px] md:text-[14px] mb-3 font-poppins-regular text-gray-300">
            Copy and paste this code to embed this event on your website:
          </Text>

          <Textarea
            value={`<div style="width: 100%; height: 100vh; display: flex; justify-content: center;">
                <iframe src='${process.env.NEXT_PUBLIC_PAGE_BASE_URL}embeded/${slug}'
                    style="border: 1px solid #bfcbda88; border-radius: 4px; width:100%; height:100%;" allowfullscreen
                    aria-hidden="false" tabindex='0'></iframe>
            </div>`}
            autosize
            minRows={4}
            readOnly
            styles={{
              input: {
                backgroundColor: "#2d2d2d",
                color: "#d4d4d4",
                fontFamily: "Consolas, Monaco, monospace",
                fontSize: "14px",
                padding: "16px",
                border: "1px solid #404040",
                borderRadius: "4px",
                "&:focus": {
                  borderColor: "#007acc",
                },
                "&::-webkit-scrollbar": {
                  width: "12px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#1e1e1e",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#424242",
                  borderRadius: "6px",
                  border: "3px solid #1e1e1e",
                },
              },
              wrapper: {
                backgroundColor: "#1e1e1e",
              },
            }}
          />

          <Button
            fullWidth
            mt={16}
            color="blue"
            onClick={() => {
              navigator.clipboard
                .writeText(`<div style="width: 100%; height: 100vh; display: flex; justify-content: center;">
                <iframe src='${process.env.NEXT_PUBLIC_PAGE_BASE_URL}embeded/${slug}'
                    style="border: 1px solid #bfcbda88; border-radius: 4px; width:100%; height:100%;" allowfullscreen
                    aria-hidden="false" tabindex='0'></iframe>
            </div>`);
              showNotification({
                message: "Embed code copied to clipboard!",
                color: "blue",
              });
            }}
            styles={{
              root: {
                backgroundColor: "#007acc",
                "&:hover": {
                  backgroundColor: "#005999",
                },
              },
            }}>
            Copy Code
          </Button>
        </Box>
      </Modal>
    </>
  );
}
