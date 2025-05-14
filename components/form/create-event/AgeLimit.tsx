import { Box, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

interface AgeLimitProps<T> {
  form: UseFormReturnType<T>;
}

export default function AgeLimit<T>({ form }: AgeLimitProps<T>) {
  return (
    <Box className="w-full">
      <Text className="text-gray-800 font-medium mb-2">Age Limit</Text>
      <input
        type="number"
        placeholder="Enter minimum age (e.g. 18)"
        className="w-full p-2 border border-gray-300 rounded"
        min="0"
        {...form.getInputProps("ageLimit")}
      />
    </Box>
  );
}
