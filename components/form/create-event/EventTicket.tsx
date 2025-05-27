import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import QuestionRadiobox from "./QuestionRadiobox";
import useSelectData from "@/components/utils/hooks/useSelectData";

// Create simplified TextInput components for the demo
function LocalTextInput({ label, placeholder, form, formKey }: any) {
  return (
    <Box className="w-full">
      <Text className="text-gray-800 font-medium mb-2">{label}</Text>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded"
        {...form.getInputProps(formKey)}
      />
    </Box>
  );
}

function LocalNumberInput({
  label,
  placeholder,
  form,
  formKey,
  description,
}: any) {
  return (
    <Box className="w-full">
      <Text className="text-gray-800 font-medium mb-2">{label}</Text>
      {description && (
        <Text size="xs" color="dimmed" mb={6}>
          {description}
        </Text>
      )}
      <input
        type="number"
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded"
        {...form.getInputProps(formKey)}
      />
    </Box>
  );
}

function LocalTextarea({ label, placeholder, form, formKey }: any) {
  return (
    <Box className="w-full">
      <Text className="text-gray-800 font-medium mb-2">{label}</Text>
      <textarea
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded"
        rows={3}
        {...form.getInputProps(formKey)}
      />
    </Box>
  );
}

function LocalSelect({ label, data, form, formKey, description }: any) {
  return (
    <Box className="w-full">
      {label && <Text className="text-gray-800 font-medium mb-2">{label}</Text>}
      {description && (
        <Text size="xs" color="dimmed" mb={6}>
          {description}
        </Text>
      )}
      <select
        className="w-full p-2 border border-gray-300 rounded"
        {...form.getInputProps(formKey)}>
        <option value="">Select an option</option>
        {data?.map((item: any) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </Box>
  );
}

export default function EventTicket({
  form,
  isTour = false,
}: {
  form: UseFormReturnType<any>;
  isTour?: boolean;
}) {
  const [isSubmitting] = useState(false);
  const ticketsType = form.getInputProps("isFree").value;
  const tickets = form.getInputProps("tickets").value;
  const { data: currencyData } = useSelectData(`currency`);

  // Mock currency data
  // const currencyData = [
  //   { value: "USD", label: "$" },
  //   { value: "EUR", label: "€" },
  //   { value: "GBP", label: "£" },
  // ];

  // Add a ticket to the form
  const handleAddTicketCat = () => {
    const {
      ticketCat,
      ticketPrice,
      ticketQty,
      acceptedCurr,
      ticketsPerPurchase,
      ticketDesc,
      tickets,
    } = form.values;

    // Basic validation
    if (!ticketCat || !ticketPrice || !ticketQty || !acceptedCurr) {
      alert("Please fill all required ticket fields");
      return;
    }

    const pickedTicket = {
      ticketCat,
      ticketPrice,
      ticketQty,
      ticketDesc,
      acceptedCurr,
      ticketsPerPurchase,
    };

    const oldTickets = tickets || [];
    const totalCapacity = [...oldTickets, pickedTicket].reduce(
      (acc, curr) => acc + Number(curr?.ticketQty),
      0
    );

    form.setFieldValue("tickets", [...oldTickets, pickedTicket]);
    form.setFieldValue("maxCap", totalCapacity);
    form.setFieldValue("target", totalCapacity);
    form.setFieldValue("ticketCat", "");
    form.setFieldValue("ticketPrice", "");
    form.setFieldValue("ticketQty", "");
    form.setFieldValue("ticketDesc", "");
    form.setFieldValue("ticketsPerPurchase", 1);
  };

  // Remove a ticket from the form
  const handleRemove = (idx: number) => {
    const oldTickets = tickets.filter((_: any, index: number) => index !== idx);
    const totalCapacity = oldTickets.reduce(
      (acc: number, curr: any) => acc + Number(curr?.ticketQty),
      0
    );

    form.setFieldValue("tickets", [...oldTickets]);
    form.setFieldValue("maxCap", totalCapacity);
    form.setFieldValue("target", totalCapacity);
  };

  return (
    <div className="flex flex-col gap-6">
      {!isTour && (
        <QuestionRadiobox<any>
          label="Is this a free event?"
          type="ticket"
          form={form}
          formKey="isFree"
        />
      )}

      {tickets?.length < 1 && form?.getInputProps("isFree").value === "no" && (
        <Text className="text-orange-500 text-sm my-2">
          Complete the details below to create a ticket type
        </Text>
      )}

      {ticketsType === "no" && (
        <>
          {tickets?.length > 0 && (
            <Paper
              withBorder={tickets?.length > 0}
              radius={6}
              p={10}
              mb={10}
              className="bg-gray-50">
              <Flex wrap="wrap" gap={10}>
                {tickets?.map((ticket: any, idx: number) => (
                  <Badge
                    key={idx}
                    variant="filled"
                    p={5}
                    size="xl"
                    radius={6}
                    color="orange"
                    rightSection={
                      <ActionIcon
                        onClick={() => handleRemove(idx)}
                        size="xs"
                        variant="transparent"
                        color="red">
                        <IconX size={16} />
                      </ActionIcon>
                    }>
                    {`${ticket?.ticketCat} (${
                      currencyData.find((c) => c.value === ticket?.acceptedCurr)
                        ?.label || ""
                    } ${ticket?.ticketPrice})`}
                  </Badge>
                ))}
              </Flex>
            </Paper>
          )}

          <SimpleGrid cols={1}>
            <Stack gap={20}>
              <Group grow>
                <LocalTextInput
                  label="Ticket Category"
                  placeholder="Enter name of this ticket category"
                  formKey="ticketCat"
                  form={form}
                />
                <LocalNumberInput
                  label="Ticket Quantity"
                  placeholder="How many tickets for this category"
                  formKey="ticketQty"
                  form={form}
                />
              </Group>

              <Group grow>
                <LocalNumberInput
                  label="Ticket Price"
                  placeholder="Enter amount"
                  formKey="ticketPrice"
                  form={form}
                  description="Free ticket has a price of 0"
                />
                <LocalSelect
                  description="Accepted Currency"
                  placeholder="Select currency"
                  data={currencyData}
                  formKey="acceptedCurr"
                  form={form}
                />
              </Group>

              <LocalNumberInput
                label="Tickets Per Purchase"
                placeholder="Eg:. 4 tickets for a table of 4"
                formKey="ticketsPerPurchase"
                form={form}
                description="How many tickets are to be sent for a single purchase"
              />

              <LocalTextarea
                label="Ticket Description (optional)"
                placeholder="Enter details for this ticket category (optional)"
                formKey="ticketDesc"
                form={form}
              />
            </Stack>
          </SimpleGrid>

          {!isTour && (
            <Button
              type="button"
              onClick={handleAddTicketCat}
              loading={isSubmitting}
              variant="filled"
              color="orange"
              fullWidth
              className="mt-6 capitalize font-medium">
              Add Ticket
            </Button>
          )}
        </>
      )}
    </div>
  );
}
