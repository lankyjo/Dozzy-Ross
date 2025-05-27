import { DateTimePicker } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { useViewportSize } from "@mantine/hooks";
import { Box, Text } from "@mantine/core";

// Define border and common styles
const inputStyles = {
  border: "1px solid #444",
  borderRadius: "8px",
};

export default function LocalDateTimeInput<T>({
  label,
  form,
  formKey,
}: {
  label: string;
  formKey: string;
  form: UseFormReturnType<T>;
}) {
  const { width } = useViewportSize();

  return (
    <Box>
      <Text
        mb={8}
        fw={500}
        size={width > 700 ? "md" : "sm"}
        className="text-white"
      >
        {label} <span className="text-red-500">*</span>
      </Text>

      <DateTimePicker
        dropdownType="modal"
        valueFormat="DD MMM YYYY hh:mm a"
        placeholder="Select date and time"
        withSeconds={false}
        clearable={false}
        w="100%"
        size="md"
        styles={(theme) => ({
          input: {
            background: "rgba(30, 30, 30, 0.9)",
            color: "#fff",
            fontSize: 16,
            border: inputStyles.border,
            borderRadius: inputStyles.borderRadius,
            padding: "12px 16px",
            "&:focus": {
              border: "1px solid #ffa500",
            },
            "&::placeholder": {
              color: "#aaa",
            },
          },
          day: {
            "&[data-selected]": {
              backgroundColor: theme.colors.orange?.[6] || "#FF8C00",
              "&:hover": {
                backgroundColor: theme.colors.orange?.[7] || "#FF7800",
              },
            },
            color: "#e0e0e0",
            "&[data-outside]": {
              color: "#6f6f6f",
            },
            "&[data-weekend]": {
              color: "#b18f6a",
            },
            "&:hover": {
              backgroundColor: "rgba(255, 165, 0, 0.15)",
            },
            fontSize: "0.9rem",
            borderRadius: "4px",
            padding: "8px ",
            margin: "2px",
            minWidth: "36px",
            height: "36px",
          },
          calendarHeader: {
            width: "100%",
            padding: "12px 12px",
            backgroundColor: "rgba(30, 30, 30, 0.9)",
            display: "flex",
            justifyContent: "space-between",
          },
          calendarHeaderControl: {
            color: "#fff",
            width: 32,
            // height: 32,
            // fontSize: 16,
            "&:hover": {
              backgroundColor: "rgba(255, 165, 0, 0.15)",
            },
          },
          calendarHeaderLevel: {
            color: "#ffa500",
            fontSize: 20,
            "&:hover": {
              backgroundColor: "rgba(255, 165, 0, 0.15)",
            },
            // height: "30px",
            // padding: " 12px",
            borderRadius: "4px",
          },
          calendarHeaderLevelIcon: {
            width: 16,
            height: 16,
          },
          monthPickerControl: {
            color: "#e0e0e0",
            padding: "18px ",
            margin: "3px",
            borderRadius: "4px",
            fontSize: "0.95rem",
            "&:hover": {
              backgroundColor: "rgba(255, 165, 0, 0.15)",
            },
            "&[data-selected]": {
              backgroundColor: theme.colors.orange?.[6] || "#FF8C00",
              color: "#fff",
            },
          },
          yearPickerControl: {
            color: "#e0e0e0",
            padding: "5px 12px",
            margin: "3px",
            borderRadius: "4px",
            fontSize: "0.95rem",
            "&:hover": {
              backgroundColor: "rgba(255, 165, 0, 0.15)",
            },
            "&[data-selected]": {
              backgroundColor: theme.colors.orange?.[6] || "#FF8C00",
              color: "#fff",
            },
          },
          weekdayCell: {
            color: "#ffa500",
            fontWeight: 600,
            fontSize: "0.8rem",
            padding: "10px 0",
          },
          timeInput: {
            backgroundColor: "rgba(30, 30, 30, 0.9)",
            color: "#fff",
            border: inputStyles.border,
            fontSize: "1rem",
            width: "110px",
            height: "40px",
            "&:focus": {
              border: "1px solid #ffa500",
            },
          },
          amPmInput: {
            backgroundColor: "rgba(30, 30, 30, 0.9)",
            color: "#fff",
            border: inputStyles.border,
            fontSize: "0.95rem",
            width: "60px",
            height: "40px",
            "&:focus": {
              border: "1px solid #ffa500",
            },
          },
          timeSeparator: {
            color: "#ffa500",
            fontSize: "1.2rem",
            padding: "0 6px",
          },
          modal: {
            backgroundColor: "#222",
            
          },
          dropdown: {
            backgroundColor: "#222",
            border: "1px solid #333",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
            padding: "18px",
            maxWidth: "420px",
            width: "420px",
          },
          arrow: {
            backgroundColor: "#222",
            borderColor: "#333",
          },
          calendar: {
            maxWidth: "100%",
          
          },
          yearPicker: {
            padding: "8px",
          },
          monthPicker: {
            padding: "8px",
          },
          timeWrapper: {
            marginTop: "18px",
            padding: "16px 8px",
            borderTop: "1px solid #444",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          submitButton: {
            backgroundColor: theme.colors.orange?.[6] || "#FF8C00",
            "&:hover": {
              backgroundColor: theme.colors.orange?.[7] || "#FF7800",
            },
            fontSize: "0.9rem",
            height: "36px",
            borderRadius: "4px",
            // marginTop: "16px",
            margin: "10px",
            fontWeight: 500,
          },
          clockIcon: {
            color: "#ffa500",
            width: "20px",
            height: "20px",
            marginRight: "10px",
          },
          yearsList: {
            padding: "0 12px",
          },
          levelsGroup: {
            borderRadius: "4px",
            border: "1px solid #444",
            overflow: "hidden",
            marginBottom: "16px",
          },
          levelsGroupButton: {
            width: "auto",
            fontSize: "0.9rem",
            padding: "8px 16px",
            borderRadius: 0,
            "&[data-selected]": {
              backgroundColor: theme.colors.orange?.[6] || "#FF8C00",
            },
            "&:not([data-selected])": {
              color: "#e0e0e0",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "rgba(255, 165, 0, 0.15)",
              },
            },
          },
        })}
        {...form.getInputProps(formKey)}
      />
    </Box>
  );
}
