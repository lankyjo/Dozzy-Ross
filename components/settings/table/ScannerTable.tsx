import { Box, Button, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DataTable } from "mantine-datatable";
import { ReactNode, useEffect, useMemo, useState } from "react";
import classes from "../profileTab/AttendeesTab.module.css";
import { mutate } from "swr";
import {
  customErrorFunc,
  customNotification,
  isEmpty,
} from "@/components/utils/contextAPI/helperFunctions";
import { deleteFunc, postFunc } from "@/components/utils/request";
import EventOverviewSearchbox from "../EventOverviewSearchbox";
import useGetter from "@/components/utils/hooks/useGetter";
import SearchDialog from "@/components/modal/SearchDialog";
import IconSuccess from "@/components/icons/IconSuccess";
import IconFailure from "@/components/icons/IconFailure";
import { useParams } from "next/navigation";

function ScannnerDialog({
  opened,
  close,
  scanner,
  page,
  action,
}: {
  opened: boolean;
  action: {
    title: string;
    action: string;
    message: string | ReactNode;
  };

  page: number;
  scanner: {
    id: string;
    email: string;
  };
  close: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  async function removeScanner(id: string) {
    try {
      setLoading(true);
      const res = await deleteFunc({
        url: `event/scanner/remove?scannerId=${id}`,
        values: {},
      });
      if (res?.data?.success) {
        customNotification(
          "success",
          `${scanner.email} deleted`,
          "primary_color.0",
          <IconSuccess />
        );
        close();
        mutate(
          `event/scanner/org/event/scanners?eventId=${slug}&page=${page}&size=100`
        );
      }
    } catch (error: any) {
      customErrorFunc(error, <IconFailure />);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Modal
      opened={opened}
      onClose={close}
      title={<Text className=" font-poppins-bold ">{action.title}</Text>}
      centered>
      <div className=" h-full">
        <Text className=" mr-6 text-[13px] md:text-[14px] text-[#020c2697] font-poppins-regular md:text-poppins-medium  max-w-[410px] md:max-w-[600px]">
          {action.message}
        </Text>
        <Box className=" flex gap-3 mt-6 justify-end">
          <Button
            maw={100}
            onClick={close}
            variant="outline"
            className="capitalize text-secondary_color border-secondary_color font-poppins-medium font-medium rounded-md ">
            No
          </Button>
          <Button
            maw={100}
            loading={loading}
            onClick={() => removeScanner(scanner?.id)}
            variant=""
            className="capitalize text-white bg-secondary_color font-poppins-medium font-medium rounded-md ">
            Yes
          </Button>
        </Box>
      </div>
    </Modal>
  );
}

export default function ScannerTable() {
  const { data: user } = useGetter("user");
  const [page] = useState<number>(1);
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const [isSearching, setIsSearching] = useState(false);
  const [scanner, setScanner] = useState({} as { id: string; email: string });
  const [inputValidation, setInputValidation] = useState("");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [inviteMessage, setInviteMessage] = useState({
    success: false,
    message: "",
    error: false,
  });
  const { data, isLoading } = useGetter(
    `event/scanner/org/event/scanners?eventId=${slug}&page=${page}&size=100`
  );
  const [records, setRecords] = useState<ScannerProps[]>([]);

  const scanners: ScannerProps[] = useMemo(() => {
    if (data?.data?.data) {
      return (
        data.data.data.map((scanner: ScannerProps) => ({
          ...scanner,
          id: scanner._id,
          name: !isEmpty(scanner?.user?.firstName)
            ? scanner?.user?.firstName + " " + isEmpty(scanner?.user?.lastName)
              ? ""
              : scanner?.user?.lastName
            : scanner.user?.username,
          email: scanner?.user?.email,
          action: {
            email: scanner?.user?.email,
            id: scanner?._id,
          },
        })) ?? []
      );
    }
  }, [data]);

  useEffect(() => {
    setRecords(scanners);
  }, [scanners]);

  const [opened, { open, close }] = useDisclosure(false);
  const [action, setAction] = useState({
    action: "",
    title: "",
    message: "",
  } as {
    action: string;
    title: string;
    message: string | ReactNode;
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setInputValidation("");
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [inputValidation]);

  function removeScanner(scanner: ScannerProps) {
    setAction({
      action: "remove",
      title: "Remove Scanner",
      message: `Do you want to remove ${scanner?.email} as a scanner for this event?`,
    });

    setScanner({
      id: scanner?._id,
      email: scanner.user?.email,
    });
    open();
  }

  async function handleSearch(e: string) {
    if (user?.data?.email.toLowerCase() === e?.toLowerCase()) {
      setInputValidation("You cannot add yourself as a scanner");
      return;
    }
    const isEmailAdded = scanners.find(
      (scanner) => scanner?.email?.toLowerCase() === e?.toLowerCase()
    );
    if (isEmailAdded) {
      setInputValidation("User already added as a scanner");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(e);
    if (!isEmail) {
      setInputValidation("Enter a valid email");
      return;
    }

    try {
      setIsSearching(true);
      const res = await postFunc({
        values: {
          eventId: slug,
          email: e,
        },
        url: "event/scanner/invite",
      });

      if (res?.data?.success) {
        setInviteMessage({
          ...inviteMessage,
          success: true,
          message: "Invite sent successfully",
          error: false,
        });
        mutate(
          `event/scanner/org/event/scanners?eventId=${slug}&page=${page}&size=100`
        );
      }
    } catch (error: any) {
      setInviteMessage({
        ...inviteMessage,
        success: false,
        message: error?.response?.data?.message,
        error: true,
      });
    } finally {
      setIsSearching(false);
      setOpenSearchDialog(true);
    }
  }

  return (
    <>
      {openSearchDialog && (
        <SearchDialog
          close={setOpenSearchDialog}
          opened={openSearchDialog}
          message={inviteMessage}
        />
      )}

      {
        <ScannnerDialog
          close={close}
          opened={opened}
          scanner={scanner}
          page={page}
          action={action}
        />
      }

      <EventOverviewSearchbox
        title="Enter email address to invite a scanner"
        subtitle=""
        placeholder={""}
        handleSearch={(e) => handleSearch(e)}
        isSearching={isSearching}
        action={"Invite"}
        inputValidation={inputValidation}
        setInputValidation={setInputValidation}
      />

      <Box>
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
          noRecordsText="No scanner has been invited yet"
          fs="sm"
          columns={[
            {
              accessor: "id",
              title: "#",
              textAlign: "center",
              width: 30,
              ellipsis: true,
              cellsStyle: () => () => ({
                fontFamily: "poppins-regular",
              }),

              render: (record) => records.indexOf(record) + 1,
            },

            {
              accessor: "email",
              title: "Email Address",
              width: 200,
              ellipsis: true,
              cellsStyle: () => () => ({
                fontFamily: "poppins-regular",
              }),
            },
            {
              accessor: "status",
              title: "Status",
              width: 120,
              textAlign: "center",
              cellsStyle: () => () => ({
                fontFamily: "poppins-regular",
              }),

              render: (record) => (
                <Text
                  className={`${
                    record.status?.toLowerCase() === "accepted"
                      ? "text-[#3B822E] text-[13px] md:text-[14px] font-poppins-regular bg-[#E9F5EA] rounded-xl p-2 text-center"
                      : "text-[#bb4b4b] text-[13px] md:text-[14px] font-poppins-regular bg-[#f5e9e9] rounded-xl p-2 text-center"
                  }`}>
                  {record.status}
                </Text>
              ),
            },
            {
              accessor: "action",
              textAlign: "center",
              width: 80,
              render: (record) => (
                <Button
                  fullWidth
                  onClick={() => removeScanner(record)}
                  maw={100}
                  variant="white"
                  className="capitalize text-white bg-secondary_color rounded-full mx-auto  text-[12px] cursor-pointer md:text-[14px] font-poppins-medium  p-2 text-center">
                  remove
                </Button>
              ),
            },
          ]}
          totalRecords={data?.data?.data?.meta?.total ?? 0}
        />
      </Box>
    </>
  );
}
