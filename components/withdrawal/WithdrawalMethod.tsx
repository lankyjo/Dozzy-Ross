import { Group, Radio } from "@mantine/core";
import React, { useEffect, useState } from "react";

function WithdrawalMethod({
  setMethod,
  methods,
  amount,
  form,
  method,
}: {
  setMethod: any;
  methods: any;
  amount: number;
  form: any;
  method: { withdrawalType: string; withdrawalMethod: string };
}) {
  const [methodValue, setMethodValue] = useState("");
  useEffect(() => {
    if (method?.withdrawalMethod) {
      setMethod({ withdrawalMethod: method?.withdrawalMethod });
      setMethodValue(method?.withdrawalMethod);
    } else {
      setMethod({ withdrawalMethod: methodValue });
    }
  }, [methodValue, method?.withdrawalMethod, setMethod]);

  return (
    <Radio.Group
      value={methodValue}
      c={"#171717"}
      onChange={(e) => {
        form.reset();
        setMethod({ ...methods, withdrawalMethod: e });
        setMethodValue(e);
        form.setFieldValue("amount", amount);
      }}
      name="withdrawalMethod"
      label="Select withdrawal method"
      description=""
      withAsterisk>
      <Group mt="xs" justify="apart" gap={14}>
        <div className=" flex gap-4">
          {methods?.map((method: any, index: number) => (
            <Radio
              key={index}
              c={"transparent"}
              value={method?._id}
              label=""
              description={method?.displayName}
              color="#EF790D"
              labelPosition="left"
              variant="outline"
              className="w-full text-nowrap flex-wrap"
            />
          ))}
        </div>
      </Group>
    </Radio.Group>
  );
}

export default WithdrawalMethod;
