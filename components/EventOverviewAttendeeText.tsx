import { Flex, Text } from "@mantine/core";

export default function EventOverviewAttendeeText({
  label,
  value,
  normal,
  isFree,
}: {
  label: string;
  value: string | any;
  normal: boolean;
  isFree: boolean;
}) {
  return (
    <Flex justify="space-between" align="center" gap={20}>
      <Text
        w={220}
        fw={400}
        ta="left"
        ff="poppins-regular"
        tt="capitalize"
        fz={{ base: 12, sm: 14 }}
        className="cursor-pointer font-poppins-regular"
        c="black_300.0">
        {label === "category" && isFree ? "fee" : label || "free"}
      </Text>
      <Text
        w={220}
        fw={500}
        ff="poppins-medium"
        tt={normal ? "lowercase" : "capitalize"}
        fz={{ base: 12, sm: 13 }}
        className="cursor-pointer font-poppins-regular text-end"
        c="primary_color.0">
        {label === "amount" && isFree ? "free" : value || "free"}
      </Text>
    </Flex>
  );
}
