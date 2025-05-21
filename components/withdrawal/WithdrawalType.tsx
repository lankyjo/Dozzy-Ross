import { Group, Radio } from "@mantine/core";
import React, { useState } from "react";

function WithdrawalType() {
  const [typeValue, setTypeValue] = useState("premium");
  return (
    
      <Radio.Group
        value={typeValue}
        onChange={setTypeValue}
        name="withdrawalType"
        label="Withdrawal type"
        description="fee $2"
        withAsterisk
      >
        <Group mt="xs">
          <Radio
            value="premium"
            label=""
            description="Instant withdrawal (Premium)"
            color="orange"
            labelPosition="left"
          />
          <Radio
            value="regular"
            label=""
            description="24hrs withdrawal (Regular)"
            color="orange"
            labelPosition="left"
          />
        </Group>
      </Radio.Group>
   
  
  );
}

export default WithdrawalType;
