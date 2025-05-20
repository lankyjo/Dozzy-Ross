import { Badge, Box, Button, Flex, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCamera, IconSearch } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useEffect, useMemo, useState } from "react";
import { inputBorder } from "@/components/global/inputs/LocalTextinput";
import EventOverviewAttendeeModal from "@/components/modal/EventOverviewAttendeeModal";
import ScannarModal from "@/components/modal/ScannarModal";
import useGetter from "@/components/utils/hooks/useGetter";
import { useParams } from "next/navigation";
import { postFunc } from "@/components/utils/request";
import classes from "./AttendeesTab.module.css";
import { isEmpty } from "@/components/utils/contextAPI/helperFunctions";

export default function AttendeesTab({
  eventDetail,
  setTicketOverview,
}: {
  eventDetail: SingleEventProps;
  setTicketOverview: (group: { total: number; _id: string }[]) => void;
}) {
  const [query, setQuery] = useState<string>("");
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [openScanner, closeScanner] = useState<boolean>(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [info, showInfo] = useState();
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const { data: attendeesList, isLoading } = useGetter(
    `event/attendees?eventId=${slug}&page=${page}&size=100`
  );
  const [records, setRecords] = useState<AttendeeProps[]>([]);

  const filteredData = useMemo(() => {
    return (
      attendeesList?.data?.data?.map((item: AttendeeProps) => ({
        id: item?._id,
        ...item,
      })) ?? []
    );
  }, [attendeesList]);

  useEffect(() => {
    if (!query) setRecords(filteredData);
    if (filteredData?.length) {
      if (attendeesList?.data?.stats?.length) {
        setTicketOverview(attendeesList.data.stats);
      } else {
        setTicketOverview([]);
      }
    }
  }, [attendeesList?.data?.stats, query, filteredData, setTicketOverview]);

  function handleView(anttendee_info: any) {
    showInfo({
      ...anttendee_info,
      currencySymbol: eventDetail?.currency?.symbol,
    });
    open();
  }

  const handleFSearch = async () => {
    setIsSearching(true);
    const isEmail: boolean = query?.includes("@") && query?.includes(".");
    const tValue: string = query.toLowerCase();
    try {
      const attendees = await postFunc({
        url: `event/attendees/search?eventId=${slug}&name=${
          !isEmail ? tValue : ""
        }&email=${isEmail ? tValue : ""}`,
        values: {},
      });

      if (attendees?.data?.data?.data?.length) {
        const info = attendees.data.data.data.map((item: AttendeeProps) => ({
          id: item?._id,
          ...item,
        }));
        setRecords(info);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 800); // shake duration matches animation length
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SearchForAttendee
        query={query}
        setQuery={setQuery}
        isSearching={isSearching}
        handleSearch={handleFSearch}
      />

      <Box h={records?.length ? 600 : 0} mt={40}>
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
          minHeight={180}
          noRecordsText={isEmpty(records) ? "No attendees found" : ""}
          columns={[
            {
              accessor: "id",

              title: "#",
              textAlign: "center",
              width: "0%",
              render: (record) => records.indexOf(record) + 1,
            },
            {
              accessor: "name",
              // width: 150,
              cellsStyle: () => () => ({
                transform: "uppercase",
              }),
              render: (record) => (
                <Text className="cursor-pointer text-[12px] md:text-[13px] font-poppins-medium">
                  {record?.name || record?.name}
                </Text>
              ),
            },
            {
              accessor: "code",
              title: "Ticket ID",
              textAlign: "center",
              // width: 100,
              ellipsis: true,

              render: (record) => (
                <Text className="cursor-pointer text-[12px] md:text-[13px] font-poppins-medium">
                  {record?.code || record?.itemCount}
                </Text>
              ),
            },
            {
              accessor: "actions",
              title: "View",
              textAlign: "center",
              width: "0%",
              render: (record) => (
                <Badge
                  fullWidth
                  variant="transparent"
                  bg={record.checkedIn ? "#E9F5EA" : "#f5e9e9"}
                  c={record.checkedIn ? "#3B822E" : "#bb4b4b"}
                  size="md">
                  {record.checkedIn ? "Checked In" : "Not Checked In"}
                </Badge>
              ),
            },
          ]}
          totalRecords={attendeesList?.data?.meta?.total ?? 0}
          recordsPerPage={100}
          page={page}
          onPageChange={setPage}
          idAccessor={"_id"}
          onRowClick={(record) => {
            handleView(record?.record);
          }}
        />
        <>
          {Boolean(Number(eventDetail?.totalTicketsSold)) &&
            !["Rejected"]?.includes(eventDetail?.approvalStatus || "") && (
              <Box className="fixed z-10 bottom-0 left-0 py-2 backdrop-filter backdrop-blur-sm w-full">
                <Flex justify={"center"} align={"center"}>
                  <Button
                    variant="white"
                    rightSection={<IconCamera size={24} />}
                    radius={100}
                    c={"#171717"}
                    // c="white"
                    size="lg"
                    fw={500}
                    className={`relative bg-orange-500 border-[#EF790D] flex justify-center items-center font-poppins-medium ${
                      isShaking ? "shake" : ""
                    }`}
                    onClick={() => closeScanner(true)}>
                    Scan ticket
                  </Button>
                </Flex>
              </Box>
            )}
        </>
      </Box>
      {opened && (
        <EventOverviewAttendeeModal
          open={opened}
          close={close}
          data={info}
          refetch={`event/attendees?eventId=${slug}&page=${page}&size=100`}
        />
      )}
      {openScanner && (
        <ScannarModal
          eventId={slug || ""}
          openedScanner={openScanner}
          closeScanner={closeScanner}
          refetch={`event/attendees?eventId=${slug}&page=${page}&size=100`}
          tickets={attendeesList?.data?.data}
          event={eventDetail}
        />
      )}
    </>
  );
}

function SearchForAttendee({
  query,
  setQuery,
  handleSearch,
  isSearching,
}: {
  query: string;
  setQuery: (value: string) => void;
  handleSearch: () => void;
  isSearching: boolean;
}) {
  return (
    <Flex className="w-full space-y-0 flex items-center space-x-4 md:space-x-8">
      <TextInput
        size="md"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className=" w-full max-w-[700px] rounded-lg"
        placeholder="Search by attendee name or email"
        rightSection={<IconSearch size={20} />}
        styles={() => ({
          input: {
            width: "100%",
            maxWidth: 700,
            border: inputBorder.border,
            fontFamily: "poppins-regular",
            fontSize: 14,
            "&:focus": {
              border: inputBorder.border,
            },
          },
        })}
      />
      <Button
        size="md"
        onClick={handleSearch}
        loading={isSearching}
        bg={"#EF790D"}
        variant=""
        className="bg-secondary_color text-white capitalize font-poppins-medium font-medium rounded-lg">
        Search
      </Button>
    </Flex>
  );
}
