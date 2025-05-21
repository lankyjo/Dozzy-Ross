import { Box } from "@mantine/core";
import React from "react";
import SingleTextInput from "../global/inputs/SingleTextInput";

function PayPalDetails() {
  return (
    <Box className="">
      <SingleTextInput
        label="Enter Account ID"
        placeholder="Please fill appropriately"
        value={""}
        setMethod={() => {}}
      />
    </Box>
  );
}

export default PayPalDetails;
