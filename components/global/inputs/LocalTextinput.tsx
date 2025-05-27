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
  type = "text",
  required = false,
  readOnly = false,
}: {
  label: string;
  placeholder: string;
  formKey: string;
  form: UseFormReturnType<T>;
  isDisabled?: boolean;
  rightSection?: React.ReactNode;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
}) {
  const { height, width } = useViewportSize();

  // Get input props with modifications to ensure value is never undefined
  const inputProps = form.getInputProps(formKey);
  // Ensure value is always a defined string to prevent uncontrolled to controlled input error
  const value = inputProps.value === undefined ? "" : inputProps.value;

  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      withAsterisk
      disabled={isDisabled}
      rightSection={rightSection}
      required={required}
      readOnly={readOnly}
      type={type}
      styles={() => ({
        label: {
          color: "#171717",
          fontFamily: "poppins-regular",
          fontWeight: 400,
          fontSize: width > 700 ? 17 : 14,
        },
        input: {
          height: height > 700 ? 50 : 40,
          border: inputBorder.border,
          fontFamily: "poppins-regular",
          color: "#171717",
          fontSize: 16,
          background: "white",
          borderRadius: inputBorder.borderRadius,
          "&:focus": {
            border: inputBorder.border,
          },
        },
      })}
      // Spread modified input props with defined value
      {...inputProps}
      value={value}
    />
  );
}
