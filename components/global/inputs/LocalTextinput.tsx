import { TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useViewportSize } from "@mantine/hooks";

export const inputBorder = {
  border: "1px solid #ddd",
  borderRadius: 4,
};

export default function LocalTextinput<T>({
  label,
  placeholder,
  formKey,
  form,
  isDisabled = false,
  rightSection,
}: {
  label: string;
  placeholder: string;
  formKey: string;
  form: UseFormReturnType<T>;
  isDisabled?: boolean;
  rightSection?: React.ReactNode;
}) {
  const { height, width } = useViewportSize();
  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      withAsterisk
      disabled={isDisabled}
      rightSection={rightSection}
      styles={(theme) => ({
        label: {
          color: theme.colors.primary_color?.[1] || theme.colors.gray[8],
          fontFamily: "poppins-regular",
          fontWeight: 400,
          fontSize: width > 700 ? 17 : 14,
        },
        input: {
          height: height > 700 ? 50 : 40,
          border: inputBorder.border,
          fontFamily: "poppins-regular",
          fontSize: 16,
          borderRadius: inputBorder.borderRadius,
          "&:focus": {
            border: inputBorder.border,
          },
        },
      })}
      {...form.getInputProps(formKey)}
    />
  );
}
