import { Box, Group, Radio, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

interface QuestionRadioboxProps<T> {
  form: UseFormReturnType<T>;
  formKey: string;
  label: string;
  type?: "ticket" | "privacy" | string;
}

export default function QuestionRadiobox<T>({
  form,
  formKey,
  label,
  type,
}: QuestionRadioboxProps<T>) {
  return (
    <Box>
      <Text className="text-gray-800 font-medium mb-2">{label}</Text>
      <Radio.Group name={formKey} {...form.getInputProps(formKey)}>
        <Group mt="xs">
          <Radio
            value="yes"
            label={
              type === "ticket"
                ? "Yes, free event"
                : type === "privacy"
                ? "Yes, private event"
                : "Yes"
            }
          />
          <Radio
            value="no"
            label={
              type === "ticket"
                ? "No, paid event"
                : type === "privacy"
                ? "No, public event"
                : "No"
            }
          />
        </Group>
      </Radio.Group>
    </Box>
  );
}
