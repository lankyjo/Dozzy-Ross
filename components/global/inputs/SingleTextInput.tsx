import { TextInput } from "@mantine/core";

export const inputBorder = {
  borderRadius: "6px",
  border: "1px solid rgba(43, 56, 101, 0.60)",
};
export default function SingleTextInput({
  label,
  placeholder,
  value,
  setMethod,
}: {
  label: string;
  placeholder: string;
  value: string;
  setMethod: (value: string) => void;
}) {
  return (
    <TextInput
      aria-label={label}
      size="md"
      label={label}
      placeholder={placeholder}
      c={"#171717"}
      className="w-full"
      styles={() => ({
        label: {
          color: "#171717",
          fontFamily: "poppins-regular",
          fontWeight: 400,
          fontSize: 17,
          textTransform: "capitalize",
        },
        input: {
          marginTop: 7,
          border: inputBorder.border,
          fontFamily: "poppins-regular",
          fontSize: 14,
          //  borderRadius: inputBorder.borderRadius,
          "&:focus": {
            //  border: inputBorder.border,
          },
        },
      })}
      value={value}
      onChange={(event) => setMethod(event.currentTarget.value)}
    />
  );
}
