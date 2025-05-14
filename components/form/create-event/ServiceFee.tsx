import { UseFormReturnType } from "@mantine/form";
import { Select, Text } from "@mantine/core";

export default function ServiceFee({ form }: { form: UseFormReturnType<any> }) {
  return (
    <div className="w-full">
      <Text className="text-gray-800 font-medium mb-2">
        Who pays the service fee?
      </Text>
      <Select
        data={[
          { value: "organizer", label: "Event Organizer" },
          { value: "user", label: "Event Attendees" },
        ]}
        placeholder="Select who pays the service fee"
        {...form.getInputProps("feePayer")}
      />
    </div>
  );
}
