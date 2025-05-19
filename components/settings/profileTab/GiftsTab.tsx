import { Avatar, Box, Text } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { useMemo, useState } from "react";
import { defaultCurrency } from "@/components/utils/contextAPI/helperFunctions";
import useGetter from "@/components/utils/hooks/useGetter";
import classes from "./AttendeesTab.module.css";
import { useParams } from "next/navigation";
import GiftDetailsModal from "@/components/modal/GiftDetailsModal";
type GiftProps = {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  user: {
    username: any;
    email: any;
    _id: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
  reservation: {
    fullName: string;
    email: string;
  };
};

export default function GiftsTab() {
  const [page] = useState<number>(1);
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { data: gifts, isLoading } = useGetter(
    `event/bought-wishlists?eventId=${slug}&page=${page}&size=100`
  );
  const { data: currencies } = useGetter(`currency`);
  const [selectedUser, setSelectedUser] = useState<GiftProps[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const userSummary = useMemo(() => {
    const summary: Record<
      string,
      {
        totalItems: number;
        totalPrice: number;
        user: GiftProps["user"];
        reservation: GiftProps["reservation"];
        currencySymbol: string;
      }
    > = {};
    const currency = currencies?.data?.find(
      (item: any) => item?._id === gifts?.data?.data[0]?.currency
    )?.symbol;

    gifts?.data?.data?.forEach((gift: any) => {
      const userId = gift.user?._id;
      if (!summary[userId]) {
        summary[userId] = {
          totalItems: 0,
          totalPrice: 0,
          user: gift?.user,
          reservation: gift?.reservation,
          currencySymbol: currency,
        };
      }
      summary[userId].totalItems += gift?.quantity;
      summary[userId].totalPrice += gift?.price * gift?.quantity;
    });

    return Object.values(summary);
  }, [gifts?.data?.data, currencies?.data]);

  const handleRowClick = (user: GiftProps["user"], currency: string) => {
    let userGifts = gifts?.data?.data?.filter(
      (gift: any) => gift.user._id === user._id
    );
    userGifts = userGifts?.map((gift: any) => ({
      ...gift,
      currencySymbol: currency,
    }));
    setSelectedUser(userGifts);
    setModalOpen(true);
  };

  return (
    <Box h={600}>
      <DataTable
        classNames={{
          header: classes.header,
          footer: classes.footer,
          pagination: classes.pagination,
        }}
        withColumnBorders
        withRowBorders
        records={userSummary}
        fetching={isLoading}
        loaderSize="md"
        loaderColor="#EF790D"
        minHeight={180}
        noRecordsText="No records"
        columns={[
          {
            accessor: "user",
            title: "User",
            render: ({ user, reservation }) => (
              <Box className="flex items-center">
                <Avatar src={user?.imageUrl} size="sm" />
                <Box className="flex flex-col items-start justify-start">
                  <Text
                    ml="sm"
                    className="text-start capitalize">{`Gifter: ${reservation?.fullName}`}</Text>
                  <Text
                    ml="sm"
                    className="text-start cap">{`${reservation?.email}`}</Text>
                </Box>
              </Box>
            ),
          },
          {
            accessor: "totalItems",
            title: "Total gift",
            textAlign: "center",
            render: ({ totalItems }) => `${totalItems?.toLocaleString()} items`,
          },
          {
            accessor: "totalPrice",
            title: "Total Price",
            textAlign: "center",
            render: ({ totalPrice, currencySymbol }) =>
              `${
                currencySymbol || defaultCurrency
              }${totalPrice?.toLocaleString()}`,
          },
        ]}
        onRowClick={({ record }) =>
          handleRowClick(record?.user, record?.currencySymbol)
        }
      />

      {selectedUser && (
        <GiftDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          gifts={selectedUser}
          reservation={selectedUser[0]?.reservation}
        />
      )}
    </Box>
  );
}
