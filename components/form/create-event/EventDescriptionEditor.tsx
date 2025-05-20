import { EventFormValues } from "@/components/global/GeneralCreateEventForm";
import { Box, Text, Textarea } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

interface EventDescriptionEditorProps {
  form: UseFormReturnType<EventFormValues>;
  label: string;
}

export default function EventDescriptionEditor({
  form,
  label,
}: EventDescriptionEditorProps) {
  return (
    <Box className="w-full">
      <Text className="text-gray-800 font-medium mb-2">{label}</Text>
      <Textarea
        placeholder="Describe your event"
        className="w-full"
        minRows={4}
        {...form.getInputProps("description")}
      />
      {/* <Text size="xs" color="dimmed" mt={5}>
        {form?.values?.description?.length || 0}/1000 characters
      </Text> */}
    </Box>
  );
}
