import LocalDateTimeInput from "@/components/global/inputs/LocalDateTimeInput";
import { Flex, Text, Box } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React from "react";

function EventDateTime({
  form,
  isEdit,
}: {
  form: UseFormReturnType<any>;
  isEdit: boolean;
}) {
  const checkStartDate =
    new Date().getTime() > new Date(form.values.startDate).getTime() &&
    new Date(form.values.endDate).getTime() > new Date().getTime();

  const checkEndDate =
    new Date().getTime() > new Date(form.values.startDate).getTime() &&
    new Date(form.values.endDate).getTime() < new Date().getTime();

  const startDateCheck = isEdit && checkStartDate;
  const endDateCheck = isEdit && checkEndDate;

  return (
    <Flex
      direction={{ base: "column", sm: "row" }}
      gap={30}
      className={
        startDateCheck || endDateCheck ? "pointer-events-none opacity-80" : ""
      }
    >
      <Box className="w-full">
        <LocalDateTimeInput<any>
          formKey="startDate"
          label="Start Date & Time"
          form={form}
        />
        {isEdit && checkStartDate && (
          <Text className="text-red-500 mt-2 text-sm italic">
            Event has started (cannot be edited)
          </Text>
        )}
        {isEdit && checkEndDate && (
          <Text className="text-red-500 mt-2 text-sm italic">
            Event has ended (cannot be edited)
          </Text>
        )}
      </Box>

      <Box className="w-full">
        <LocalDateTimeInput<any>
          formKey="endDate"
          label="End Date & Time"
          form={form}
        />
        {isEdit && checkStartDate && (
          <Text className="text-red-500 mt-2 text-sm italic">
            Event has started (cannot be edited)
          </Text>
        )}
        {isEdit && checkEndDate && (
          <Text className="text-red-500 mt-2 text-sm italic">
            Event has ended (cannot be edited)
          </Text>
        )}
      </Box>
    </Flex>
  );
}

export default EventDateTime;
