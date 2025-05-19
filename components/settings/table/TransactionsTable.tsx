import { Badge, Box, Button, Text } from "@mantine/core";
import dayjs from "dayjs";
import { DataTable } from "mantine-datatable";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import TransactionOverviewModal from "@/components/modal/TransactionOverviewModal";
import { TempValueContext } from "@/components/utils/contextAPI/TempValueContext";
import classes from "../profileTab/AttendeesTab.module.css";
import useGetter from "@/components/utils/hooks/useGetter";
import useFormatSingleEventData from "@/components/utils/hooks/useSingleEventDataFormat";
import {
  defaultCurrency,
  defaultNumber,
} from "@/components/utils/contextAPI/helperFunctions";
export default function TransactionsTable() {
  const setVal = useContext(TempValueContext).setVal;
  const [, setRecords] = useState<any[]>([]);
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [info, showInfo] = useState({});
  const { query } = router;
  const slug = Array.isArray(query?.slug) ? query?.slug[0] : query?.slug;
  const { data: eventData, isLoading: eventLoading } = useGetter(
    `event/organizer/single?id=${slug}`
  );
  const { data: transactionData } = useGetter(`transactions?type=withdrawal`);
  const { data: withdrawalRequestData } = useGetter(
    `withdrawal-requests/me?eventId=${slug}&size=100`
  );
  const eventDetail = useFormatSingleEventData(eventData?.data, eventLoading);

  const transaction: TransactionProps[] = useMemo(() => {
    if (transactionData?.data?.data) {
      return transactionData?.data?.data?.filter(
        (transaction: { event: { _id: string }; type: string }) =>
          transaction?.event?._id === slug &&
          transaction?.type?.toLowerCase() === "withdrawal"
      );
    }
  }, [transactionData, slug]);

  useEffect(() => {
    setRecords(transaction);
  }, [transaction]);

  function handleView(transaction_info: any) {
    const attachment = withdrawalRequestData?.data?.data?.find(
      (attach: { reference: string }) =>
        attach?.reference === transaction_info?.reference
    );

    transaction_info = {
      ...transaction_info,
      withdrawalMethod: attachment?.withdrawalMethod?.displayName || "",
      note: attachment?.note || "",
      media: attachment?.medias || [],
      inputField: attachment?.inputFields || [],
      event: { title: eventDetail?.title },
    };

    showInfo({ ...transaction_info });
    open();
  }

  return (
    <>
      <Box className="h-fit max-h-[550px]">
        <Box className="w-full md:w-full lg:max-w-[591px] xl:max-w-[591px] mb-4 sm:w-full p-0">
          <div>
            <Box className="flex justify-between">
              <Text className="text-text_label mt-4 capitalize text-[13px] md:text-[15px] font-poppins-regular">
                Available Balance
              </Text>
            </Box>

            <Box>
              <div className="flex gap-4 justify-start items-center mt-1">
                <Text className="font-poppins-semibold text-[30px]">
                  {eventDetail?.currency?.symbol || defaultCurrency}
                  {eventDetail?.availableBalanceAmount
                    ? Math.round(
                        eventDetail?.availableBalanceAmount
                      )?.toLocaleString()
                    : defaultNumber}
                </Text>
              </div>
            </Box>

            {Boolean(eventDetail?.totalSalesAmount) && (
              <Box className="my-6 mx-auto">
                <Button
                  variant=""
                  disabled={
                    !Boolean(Number(eventDetail?.availableBalanceAmount)) ||
                    Number(eventDetail?.availableBalanceAmount) < 1
                  }
                  onClick={() => {
                    setVal({
                      type: "withdrawal",
                    });
                    router.push({
                      pathname: "/profile/withdraw",
                      query: {
                        event: eventDetail?._id,
                        currency: eventDetail?.currency?._id,
                      },
                    });
                  }}
                  className="bg-secondary_color rounded-md text-center text-white font-poppins-medium text-[12px]">
                  Withdraw Available Balance
                </Button>
              </Box>
            )}
          </div>
        </Box>

        <DataTable
          classNames={{
            header: classes.header,
            footer: classes.footer,
            pagination: classes.pagination,
          }}
          withColumnBorders
          withRowBorders
          textSelectionDisabled
          records={withdrawalRequestData?.data?.data}
          fetching={false}
          loaderSize="md"
          loaderColor="#EF790D"
          minHeight={180}
          fz="sm"
          noRecordsText={
            eventLoading ? "Please Wait..." : "No transaction has been made yet"
          }
          fs="sm"
          columns={[
            {
              accessor: "referenceAndDate",
              title: "Reference & Date",
              textAlign: "center",
              width: 180,
              ellipsis: true,
              render: (record) => (
                <Box>
                  <Text className="cursor-pointer text-[12px] md:text-[13px] font-poppins-regular">
                    {(record as { reference?: string }).reference || "—"}
                  </Text>
                  <Text className="text-[11px] md:text-[12px] text-gray-500">
                    {dayjs(
                      (record as unknown as { createdAt: string }).createdAt
                    ).format("MM/DD/YYYY")}
                  </Text>
                </Box>
              ),
            },
            {
              accessor: "amount",
              title: "Amount",
              width: 100,
              textAlign: "center",
              ellipsis: true,
              render: (record) => (
                <Text className="cursor-pointer text-[12px] md:text-[13px] font-poppins-regular">
                  {eventDetail?.currency?.symbol || defaultCurrency}{" "}
                  {(record as { amount: number }).amount
                    ? Number(
                        (record as { amount: number }).amount
                      ).toLocaleString()
                    : defaultNumber}
                </Text>
              ),
            },
            {
              accessor: "status",
              textAlign: "center",
              width: 100,
              ellipsis: true,
              cellsStyle: () => ({
                fontFamily: "poppins-regular",
                textTransform: "capitalize",
              }),

              render: (record) => (
                <StatusBadge status={(record as { status: string }).status} />
              ),
            },
          ]}
          idAccessor={"_id"}
          onRowClick={(record: Record<string, unknown>) => {
            handleView({
              ...record,
              currencySymbol: eventDetail?.currency?.symbol,
            });
          }}
        />
      </Box>

      <TransactionOverviewModal open={opened} close={close} data={info} />
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      fz={14}
      fw={400}
      tt="capitalize"
      color={
        status.toLowerCase() === "completed"
          ? "green.8"
          : status.toLowerCase() === "pending"
          ? "yellow.8"
          : "red.8"
      }>
      {status}
    </Badge>
  );
}
