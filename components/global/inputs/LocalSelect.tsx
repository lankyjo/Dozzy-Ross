import { Select } from "@mantine/core";
import { inputBorder } from "./LocalTextinput";
import { useViewportSize } from "@mantine/hooks";
import { UseFormReturnType } from "@mantine/form";

export default function LocalSelect<T>({
  label,
  description,
  placeholder,
  data,
  formKey,
  form,
  isEdit = false,
  size = "lg",
}: {
  label: string;
  description: string;
  placeholder: string;
  data: { value: string; label: string }[];
  formKey: string;
  form: UseFormReturnType<T>;
  isEdit?: boolean;
  size?: string;
}) {
  const { width } = useViewportSize();
  return (
    <Select
      withAsterisk
      size={size}
      label={label}
      readOnly={isEdit}
      description={description}
      placeholder={placeholder}
      c={"#171717"}
      searchable
      data={data || []}
      className="w-full"
      styles={() => ({
        label: {
          // color: theme.colors.primary_color[1],
          fontFamily: "poppins-regular",
          fontWeight: 400,
          fontSize: width > 700 ? 17 : 14,
        },
        input: {
          // width: "auto",
          marginTop: 7,
          background: "white",
          // border: inputBorder.border,
          color: "#171717",
          fontFamily: "poppins-regular",
          fontSize: 16,
          borderRadius: inputBorder.borderRadius,
          "&:focus": {
            // border: inputBorder.border,
          },
          textTransform: "capitalize",
        },
        description: {
          fontFamily: "poppins-regular",
          //color: theme.colors.primary_color[1],
          fontWeight: 400,
          fontSize: width > 700 ? 17 : 14,
        },
        item: {
          fontFamily: "poppins-regular",
          fontWeight: 400,
          fontSize: 14,
          paddingTop: 6,
          zIndex: 1000,
          paddingBottom: 6,
          textTransform: "capitalize",
          "&[data-selected]": {
            "&, &:hover": {
              //   backgroundColor: theme.colors.primary_color[0],
            },
          },
        },
      })}
      {...form.getInputProps(formKey)}
    />
  );
}
