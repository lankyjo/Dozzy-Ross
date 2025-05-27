import {
  Button,
  Flex,
  Modal,
  MultiSelect,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { FormEvent, useMemo, useState } from "react";
import { isNotEmpty, useForm } from "@mantine/form";

import { mutate } from "swr";
import IconSuccess from "../icons/IconSuccess";
import IconFailure from "../icons/IconFailure";
import {
  customErrorFunc,
  customNotification,
} from "../utils/contextAPI/helperFunctions";
import { postFunc } from "../utils/request";

type CreateCouponProps = {
  name: string;
  description: string;
  code: string;
  discount: number;
  eventId: string;
  totalAvailable: number;
  startDate: Date;
  endDate: Date;
  ticketGroupIds: string[];
};

type CouponProps = Pick<
  CreateCouponProps,
  "code" | "discount" | "totalAvailable" | "ticketGroupIds"
>;

export default function CouponModal({
  opened,
  close,
  _id,
  seatCapacity,
  endDate,
  mutateUrl,
  ticketGroups,
}: {
  opened: boolean;
  close: () => void;
  _id: string;
  seatCapacity: number;
  endDate: Date;
  mutateUrl: string;
  ticketGroups: TicketGroup[];
}) {
  const [loader, setLoader] = useState<boolean>(false);
  const form = useForm<CouponProps>({
    initialValues: {
      code: "",
      discount: 1,
      totalAvailable: 1,
      ticketGroupIds: [],
    },
    validateInputOnChange: ["discount", "totalAvailable"],
    validate: {
      code: isNotEmpty("Enter coupon code"),
      totalAvailable: (value) =>
        !value
          ? "Quantity is required"
          : value > seatCapacity
          ? `Quantity can't be greater than seat-capacity - ${seatCapacity}`
          : null,
      discount: (value) =>
        !value
          ? "Discount is required"
          : value > 100
          ? "Discount can't be greater than 100"
          : null,
    },
  });

  async function createCoupon({
    values,
    e,
  }: {
    values: CouponProps;
    e: FormEvent | undefined;
  }) {
    e?.preventDefault();
    setLoader(true);
    // const uniqueCode: string = generateUniqueRandomString().toUpperCase();
    const formattedCode = values.code.replace(" ", "").toUpperCase();
    const data = {
      name: formattedCode,
      description: `Congratulations, you have got a ${values.discount}% discount`,
      code: formattedCode,
      discount: values.discount,
      eventId: _id,
      totalAvailable: values.totalAvailable,
      startDate: new Date(),
      endDate: new Date(endDate),
      ticketGroupIds: values.ticketGroupIds,
    };

    try {
      const res = await postFunc<CreateCouponProps>({
        url: "coupon",
        values: data,
      });
      if (res?.data?.success) {
        customNotification(
          "success",
          res.data.message,
          "primary_color.0",
          <IconSuccess />
        );
        form.reset();
        mutate(mutateUrl);
      } else {
        customNotification(
          "warning",
          res.data.message,
          "orange.8",
          <IconFailure />
        );
      }
    } catch (error) {
      customErrorFunc(error);
    } finally {
      setLoader(false);
    }
  }

  const selectTicketGroups: { label: string; value: string }[] = useMemo(() => {
    return ticketGroups?.map((ticket: TicketGroup) => ({
      label: ticket?.name,
      value: ticket?._id,
    }));
  }, [ticketGroups]);
  return (
    <Modal
      opened={opened}
      onClose={close}
      withCloseButton
      centered
      size="lg"
      title={
        <Text fw={500} ff="poppins-medium" fz={16}>
          Create Coupon
        </Text>
      }>
      <form
        onSubmit={form.onSubmit((values, e) => createCoupon({ values, e }))}>
        <Stack gap={10}>
          <TextInput
            size="md"
            label="Coupon code"
            placeholder="Enter coupon code"
            radius={8}
            styles={(theme) => ({
              input: {
                // borderColor: theme.colors.grey_70[0],
                fontFamily: "poppins-regular",
                fontSize: 16,
                marginTop: 4,
                width: "100%",
                "&:focus": {
                  // borderColor: theme.colors.grey_70[0],
                },
              },
              label: {
                fontFamily: "poppins-regular",
                fontSize: 14,
                color: theme.colors.orange[5],
              },
              error: {
                fontSize: 12,
                fontFamily: "poppins-regular",
              },
            })}
            {...form.getInputProps("code")}
          />
          <Flex gap={10} direction={{ base: "column", md: "row" }}>
            <NumberInput
              w="100%"
              size="md"
              label="Discount percentage"
              maxLength={3}
              min={1}
              stepHoldDelay={500}
              stepHoldInterval={100}
              radius={8}
              styles={(theme) => ({
                input: {
                  // borderColor: theme.colors.grey_70[0],
                  fontFamily: "poppins-regular",
                  fontSize: 16,
                  marginTop: 4,
                  width: "100%",
                  "&:focus": {
                    // borderColor: theme.colors.grey_70[0],
                  },
                },
                label: {
                  fontFamily: "poppins-regular",
                  fontSize: 14,
                  color: theme.colors.orange[5],
                },
                error: {
                  fontSize: 12,
                  fontFamily: "poppins-regular",
                },
              })}
              {...form.getInputProps("discount")}
            />
            <NumberInput
              w="100%"
              size="md"
              label="Total available"
              type="number"
              min={1}
              stepHoldDelay={500}
              stepHoldInterval={100}
              placeholder="100"
              radius={8}
              styles={(theme) => ({
                input: {
                  // borderColor: theme.colors.grey_70[0],
                  fontFamily: "poppins-regular",
                  fontSize: 14,
                  marginTop: 4,
                  width: "100%",
                  "&:focus": {
                    // borderColor: theme.colors.grey_70[0],
                  },
                },
                label: {
                  fontFamily: "poppins-regular",
                  fontSize: 14,
                  color: theme.colors.orange[5],
                },
                error: {
                  fontSize: 12,
                  fontFamily: "poppins-regular",
                },
              })}
              {...form.getInputProps("totalAvailable")}
            />
          </Flex>
          <MultiSelect
            size="md"
            data={selectTicketGroups}
            label="Select ticket group"
            description="If left empty, coupon will apply to all groups"
            styles={(theme) => ({
              input: {
                // borderColor: theme.colors.grey_70[0],
                fontFamily: "poppins-regular",
                fontSize: 14,
                marginTop: 4,
                width: "100%",
                "&:focus-within": {
                  // borderColor: theme.colors.grey_70[0],
                },
              },
              label: {
                fontFamily: "poppins-regular",
                fontSize: 14,
                color: theme.colors.orange[5],
              },
              description: {
                fontFamily: "poppins-regular",
                fontSize: 12,
              },
              error: {
                fontSize: 12,
                fontFamily: "poppins-regular",
              },
              item: {
                fontSize: 13,
                fontFamily: "poppins-regular",
              },
            })}
            {...form.getInputProps("ticketGroupIds")}
          />

          <div className="mt-4">
            <Button
              fullWidth
              size="lg"
              type="submit"
              variant="white"
              color="gray.0"
              loading={loader}
              className="w-full capitalize border-0 text-white bg-secondary_color font-poppins-medium font-medium rounded-md ">
              create coupon
            </Button>
          </div>
        </Stack>
      </form>
    </Modal>
  );
}
