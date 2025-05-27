import ConfirmDeleteModal from "@/components/modal/ConfirmDeleteModal";
import CouponModal from "@/components/modal/CouponModal";
import useGetter from "@/components/utils/hooks/useGetter";
import { Box, Button, Flex, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DataTable } from "mantine-datatable";
import { useState, useEffect, useMemo } from "react";
import classes from "./AttendeesTab.module.css";
import { useParams } from "next/navigation";

export default function CouponTab({ eventDetail }: { eventDetail: any }) {
  const [page] = useState<number>(1);
  const [opened, { open, close }] = useDisclosure(false);
  const [show, { open: opDel, close: clDel }] = useDisclosure(false);
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [couponId, setCouponId] = useState<{
    id: string;
    code: string;
    url: string;
  }>({
    code: "",
    id: "",
    url: "",
  });

  const details = {
    ...eventDetail,
    opened,
    close,
    mutateUrl: `coupon/my-coupons?eventId=${slug}&isDeleted=false&isActive=true&size=100&page=${page}`,
  };
  const { data: coupons, isLoading } = useGetter(
    `coupon/my-coupons?eventId=${slug}&isDeleted=false&isActive=true&size=100&page=${page}`
  );
  const [records, setRecords] = useState<any[]>([]);
  const filtered: CouponProps[] = useMemo(() => {
    return (
      coupons?.data?.data?.map((coupon: CouponProps) => ({
        id: coupon?._id,
        ...coupon,
      })) ?? []
    );
  }, [coupons]);

  useEffect(() => {
    setRecords(filtered);
  }, [filtered]);

  function computeTicketGroupName(couponTicketIds: string[]): string[] {
    const ticketGroupNames = couponTicketIds
      ?.map((id: string) =>
        eventDetail?.ticketGroups?.find(
          (ticket: TicketGroup) => ticket?._id === id
        )
      )
      .map((ticket: TicketGroup) => ticket?.name);

    return ticketGroupNames;
  }
  return (
    <>
      <Box w="100%">
        <Flex justify="end" mb={10}>
          {}
          <Button
            variant="white"
            c={"#171717"}
            disabled={
              new Date().getTime() > new Date(eventDetail?.endDate).getTime()
            }
            ff="poppins-medium"
            fw={500}
            onClick={open}>
            Generate coupon +
          </Button>
        </Flex>
        <Box h={500}>
          <DataTable
            classNames={{
              header: classes.header,
              footer: classes.footer,
              pagination: classes.pagination,
            }}
            withColumnBorders
            withRowBorders
            records={records}
            fetching={isLoading}
            loaderSize="md"
            loaderColor="#EF790D"
            minHeight={150}
            noRecordsText="No coupons created yet"
            fs="sm"
            columns={[
              {
                accessor: "id",
                title: "#",
                textAlign: "center",
                width: "0%",
                render: (record) => records.indexOf(record) + 1,
                cellsStyle: () => ({
                  fontFamily: "poppins-regular",
                }),
              },
              {
                accessor: "code",
                title: "Coupon code",
                cellsStyle: () => ({
                  fontFamily: "poppins-regular",
                  textTransform: "uppercase",
                }),

                render: ({ code }) => (
                  <Text className="text-xs md:text-[13px] font-poppins-regular">
                    {code}
                  </Text>
                ),
              },
              {
                accessor: "Ticket group",
                cellsStyle: () => ({
                  fontFamily: "poppins-regular",
                  textTransform: "uppercase",
                }),
                render: ({ ticketGroups }) => (
                  <Text className="text-xs md:text-[13px] font-poppins-regular">
                    {computeTicketGroupName(ticketGroups)?.length < 1
                      ? "All ticket groups"
                      : computeTicketGroupName(ticketGroups)?.join(", ")}
                  </Text>
                ),
              },
              {
                accessor: "totalAvailable",
                textAlign: "center",

                render: ({ totalAvailable }) => (
                  <Text className="text-xs md:text-[13px] font-poppins-regular">
                    {Number(totalAvailable).toLocaleString()}
                  </Text>
                ),
              },
              {
                accessor: "totalUsed",
                textAlign: "center",

                render: ({ totalUsed }) => (
                  <Text className="text-xs md:text-[13px] font-poppins-regular">
                    {Number(totalUsed).toLocaleString()}
                  </Text>
                ),
              },
              {
                accessor: "discount",
                textAlign: "center",
                render: ({ discount }) =>
                  `${Number(discount).toLocaleString()}%`,
              },
              {
                accessor: "Action",
                textAlign: "center",
                width: 150,
                render: ({ id, code }) => (
                  <Button
                    c={"#171717"}
                    variant="white"
                    radius={100}
                    fz={13}
                    fw={500}
                    fullWidth
                    ff="poppins-medium"
                    onClick={() => {
                      setCouponId({
                        code,
                        id,
                        url: `coupon/my-coupons?eventId=${slug}&isDeleted=false&isActive=true&size=100&page=${page}`,
                      });
                      opDel();
                    }}>
                    Delete
                  </Button>
                ),
              },
            ]}
            // totalRecords={gifts?.data?.meta?.total ?? 0}
            // recordsPerPage={100}
            // page={page}
            // onPageChange={setPage}
          />
        </Box>
      </Box>
      {opened && <CouponModal {...details} />}
      {show && (
        <ConfirmDeleteModal opened={show} close={clDel} coupon={couponId} />
      )}
    </>
  );
}
