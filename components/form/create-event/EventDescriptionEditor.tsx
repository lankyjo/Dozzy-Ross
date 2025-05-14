import { Box, Text, Textarea } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

interface EventDescriptionEditorProps<T> {
  form: UseFormReturnType<T>;
  label: string;
}

export default function EventDescriptionEditor<T>({
  form,
  label,
}: EventDescriptionEditorProps<T>) {
  return (
    <Box className="w-full">
      <Text className="text-gray-800 font-medium mb-2">{label}</Text>
      <Textarea
        placeholder="Describe your event"
        className="w-full"
        minRows={4}
        {...form.getInputProps("description")}
      />
      <Text size="xs" color="dimmed" mt={5}>
        {form.values.description?.length || 0}/1000 characters
      </Text>
    </Box>
  );
}
