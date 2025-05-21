import { Box } from "@mantine/core";
import React from "react";
import LocalTextinput from "../global/inputs/LocalTextinput";
import { startCase, toLower } from "../utils/contextAPI/helperFunctions";
import LocalSelect from "../global/inputs/LocalSelect";

function BankDetails({
  withdrawalMethod,
  form,
}: {
  withdrawalMethod: any;
  form: any;
}) {
  return (
    <Box className="flex flex-wrap text-md  gap-1 space-y-2 justify-between items-center">
      {withdrawalMethod?.inputFields?.map((method: any, index: number) => {
        if (method?.type?.toLowerCase() === "select") {
          return (
            <Box
              className={`${
                withdrawalMethod?.inputFields?.length === 1
                  ? "w-full"
                  : "md:w-[45%] w-full"
              } sm:w-full`}
              key={index}>
              <LocalSelect<any>
                label={method?.name?.split("_")?.join("  ")}
                description=""
                placeholder={`Select ${method?.name?.split("_")?.join("  ")}`}
                data={[
                  {
                    value: "Saving",
                    label: "Saving",
                  },
                  {
                    value: "Current",
                    label: "Currrent",
                  },
                ]}
                form={form}
                formKey={method?.name}
              />
            </Box>
          );
        }
        return (
          <Box
            className={`${
              withdrawalMethod?.inputFields?.length === 1
                ? "w-full"
                : "md:w-[45%] w-full"
            } sm:w-full`}
            key={index}>
            <LocalTextinput
              label={startCase(toLower(method?.name?.split("_")?.join("  ")))}
              placeholder="Please fill appropriately"
              formKey={method?.name}
              isDisabled={false}
              // description={method?.required ? "" : "optional"}
              type={method?.type?.toLowerCase()}
              required={method?.required}
              form={form}
            />
          </Box>
        );
      })}
      <Box className="md:w-[45%] w-full   hidden">
        <LocalTextinput
          label="Amount"
          placeholder="Please fill appropriately"
          formKey={"amount"}
          isDisabled={false}
          form={form}
          type="number"
          readOnly={true}
        />
      </Box>
    </Box>
  );
}

export default BankDetails;
