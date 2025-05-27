import { Modal, Box, Text, Image, Stack, Grid } from "@mantine/core";
import {
  defaultCurrency,
  unavailable,
} from "../utils/contextAPI/helperFunctions";

type GiftDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  reservation: {
    fullName: string;
    email: string;
  };
  gifts: {
    _id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    user?: {
      username?: string;
    };
    currencySymbol?: string;
  }[];
};

export default function GiftDetailsModal({
  open,
  onClose,
  gifts,
  reservation,
}: GiftDetailsModalProps) {
  // Group gifts by name and image
  const groupedGifts = gifts.reduce((acc, gift) => {
    const key = `${gift.name}-${gift.image}`;
    if (!acc[key]) {
      acc[key] = { ...gift };
    } else {
      acc[key].quantity += gift.quantity;
    }
    return acc;
  }, {} as Record<string, (typeof gifts)[0]>);

  const totalValue = Object.values(groupedGifts).reduce(
    (sum, gift) => sum + gift.price * gift.quantity,
    0
  );

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Gift Details"
      size="lg"
      centered
      withOverlay>
      <Stack gap="md">
        <Grid>
          {Object.values(groupedGifts).map((gift) => (
            <Grid.Col key={gift._id} span={6}>
              <Box className="flex flex-col items-center bg-gray-100 p-4 rounded-md shadow-md">
                <Image
                  src={gift.image}
                  alt={gift.name}
                  width={100}
                  height={100}
                  style={{ borderRadius: "8px" }}
                />
                <Text w={500} mt="sm" color="orange">
                  {gift.name}
                </Text>
                <Text size="sm" color="dimmed">
                  Price: {gift?.currencySymbol || defaultCurrency}
                  {gift.price.toLocaleString()}
                </Text>
                <Text size="sm" color="dimmed">
                  Quantity: {gift.quantity}
                </Text>
              </Box>
            </Grid.Col>
          ))}
        </Grid>
        <Text fw={600} mt="lg" color="black/80">
          Total Value:{gifts[0]?.currencySymbol || defaultCurrency}{" "}
          {totalValue.toLocaleString()}
        </Text>

        {gifts?.length > 0 && (
          <Text fw={600} color="black/80">
            Username:{" "}
            {reservation?.fullName || gifts[0]?.user?.username || unavailable}
          </Text>
        )}
      </Stack>
    </Modal>
  );
}
