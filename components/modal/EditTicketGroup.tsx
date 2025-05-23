import { Button, Flex, Modal, Paper, Stack } from "@mantine/core";
import {
  LocalNumberInput,
  LocalTextarea,
  LocalTextInput,
} from "../form/create-event/EditEventTicket";
import { FormEvent, useContext, useEffect, useState } from "react";
import { TempValueContext } from "../utils/contextAPI/TempValueContext";
import { isNotEmpty, useForm } from "@mantine/form";
import { patchFunc } from "../utils/request";
import { customErrorFunc } from "../utils/contextAPI/helperFunctions";

type Props = {
  opened: boolean;
  close: () => void;
  handleUpdateTicketInputs?: (tickets: {
    ticketCat: string;
    ticketQty: number;
    ticketDesc: string;
    _id: string;
    ticketPrice: number;
    ticketsPerPurchase: number;
    acceptedCurr: any;
  }) => void;
  eventId?: string;
};

export type UpdateProps = {
  ticketGroupId: string;
  name: string;
  amount: number;
  description: string;
  quantity: number;
  ticketsPerPurchase: number;
};
export default function EditTicketGroup({
  opened,
  close,
  handleUpdateTicketInputs,
}: Props) {
  const [loader, setLoader] = useState<boolean>(false);

  const { val, setVal } = useContext(TempValueContext);
  const form = useForm<UpdateProps>({
    initialValues: {
      ticketGroupId: "",
      name: "",
      amount: 0,
      description: "",
      quantity: 0,
      ticketsPerPurchase: 0,
    },
    validate: {
      name: isNotEmpty("Required"),
      // amount: (value) => (value < 0 ? "Required" : null),
      // quantity: (value) => (!value ? "Required" : null),
      ticketsPerPurchase: (value) => (!value ? "Required" : null),
      description: (value) =>
        value && value.length > 100
          ? "Description can't be more than 100 characters"
          : null,
    },
  });

  useEffect(() => {
    if (val?._id) {
      form.setValues({
        name: val.ticketCat,
        quantity: val.ticketQty,
        description: val.ticketDesc,
        ticketGroupId: val._id,
        amount: val.ticketPrice,
        ticketsPerPurchase: val.ticketsPerPurchase,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [val]);

  function handleClose() {
    setVal("");
    close();
  }

  async function handleUpdate({
    vals,
    e,
  }: {
    vals: UpdateProps;
    e: FormEvent | undefined;
  }) {
    e?.preventDefault();
    setLoader(true);

    const values = {
      ticketGroupId: vals.ticketGroupId,
      name: vals.name,
      amount: Number(vals.amount),
      description: vals.description,
      quantity: Number(vals.quantity),
      ticketsPerPurchase: Number(vals.ticketsPerPurchase),
    };
    try {
      await patchFunc({
        values,
        url: "/ticket-group",
      });

      const ticketValue = {
        ticketCat: vals.name,
        ticketQty: Number(vals.quantity),
        ticketDesc: vals.description,
        _id: vals.ticketGroupId,
        ticketPrice: Number(vals.amount),
        ticketsPerPurchase: Number(vals.ticketsPerPurchase),
        acceptedCurr: val.acceptedCurr,
      };

      handleUpdateTicketInputs?.(ticketValue);
      handleClose();
    } catch (error) {
      customErrorFunc(error);
    } finally {
      setLoader(false);
    }
  }
  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      withCloseButton
      styles={{
        title: {
          fontWeight: 800,
        },
      }}
      centered
      size="lg"
      title={"Edit Ticket"}>
      <form onSubmit={form.onSubmit((vals, e) => handleUpdate({ vals, e }))}>
        <Paper withBorder p="md" radius="md" className="mt-6 mb-6 bg-gray-50">
          <Stack gap={16}>
            <Flex gap={16}>
              <LocalTextInput
                label="Ticket Category"
                placeholder="Enter name of this ticket category"
                formKey={"name"}
                form={form}
                isDisabled={true}
              />
              <LocalNumberInput
                label="Ticket Quantity"
                placeholder="How many tickets for this category"
                formKey={"quantity"}
                form={form}
                description=""
              />
            </Flex>
            <Flex gap={16}>
              <LocalNumberInput
                label="Ticket Price"
                placeholder="Enter amount"
                formKey={"amount"}
                form={form}
                description=""
              />
              <LocalNumberInput
                label="Tickets Per Purchase"
                placeholder="Eg:. 4 tickets for a table of 4"
                formKey={"ticketsPerPurchase"}
                form={form}
                description=""
              />
            </Flex>

            <LocalTextarea
              label="Ticket Description (optional)"
              placeholder="Enter details for this ticket category (optional)"
              formKey={"description"}
              form={form}
              length={100}
            />
            <Button
              type="submit"
              loading={loader}
              variant="filled"
              color="orange"
              fullWidth
              size="lg"
              className="w-full bg-secondary_color hover:bg-secondary_color_hover text-white capitalize font-medium font-poppins-medium">
              Update
            </Button>
          </Stack>
        </Paper>
      </form>
    </Modal>
  );
}
