import { Box, Button, Modal } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";
import useSelectData from "../utils/hooks/useSelectData";
import { customErrorFunc, isEmpty } from "../utils/contextAPI/helperFunctions";
import { LocalSelect } from "../form/create-event/EditEventTicket";
import { CreateEventHandlerParams } from "../global/GeneralEditEventForm";
import { UseFormReturnType } from "@mantine/form";
import { EventFormValues } from "../global/GeneralCreateEventForm";

export default function SelectCurrencyModal({
  opened,
  close,
  form,
  handleCreateEvent,
}: {
  opened: boolean;
  form: UseFormReturnType<EventFormValues>;

  close: Dispatch<SetStateAction<boolean>>;
  handleCreateEvent: (val: CreateEventHandlerParams) => Promise<any>;
}) {
  const { data } = useSelectData(`currency`);
  const [save, setSave] = useState(false);

  async function updateCurrency(currency: string) {
    if (isEmpty(currency)) {
      return;
    }

    try {
      setSave(true);

      const rest = form?.values;

      const restData = {
        ...rest,
        isUpdateCurrency: true,
        acceptedCurr: currency,
      };
      await handleCreateEvent({
        values: restData,
        event: undefined,
      });
      form.setFieldValue("acceptedCurr", currency);
      form.setFieldValue("isFree", "no");
      close(false);
    } catch (error: any) {
      customErrorFunc(error);
    } finally {
      setSave(false);
    }
  }
  return (
    <Modal
      opened={opened}
      onClose={() => {
        form?.setFieldValue("isFree", "yes");
        form?.setFieldValue("isWishlist", "no");
        form?.setFieldValue("acceptedCurr", "");

        close(false);
      }}
      withCloseButton={false}
      centered>
      <div className="w-full mt-2 ">
        <LocalSelect
          label="Accepted Currency"
          description="Select the currency you want to accept for this event."
          placeholder=""
          data={data}
          formKey={"acceptedCurr"}
          form={form}
        />
      </div>

      <Box className="flex justify-end gap-4 mt-4">
        <Button
          onClick={() => {
            form?.setFieldValue("isFree", "yes");
            form?.setFieldValue("isWishlist", "no");

            form?.setFieldValue("acceptedCurr", "");
            close(false);
          }}
          variant="white"
          bg="#171717"
          c="white"
          maw={100}
          type="submit"
          loaderProps={{
            color: "white",
          }}
          className=" w-full border-secondary_color hover:bg-secondary_color cursor-pointer hover:text-white rounded-lg text-secondary_color text-[17px] capitalize font-poppins-medium font-medium ">
          Cancel
        </Button>
        <Button
          onClick={async () => await updateCurrency(form?.values?.acceptedCurr)}
          variant="white"
          bg="rgb(239 121 13)"
          maw={100}
          color="white"
          loaderProps={{
            color: "white",
          }}
          loading={save}
          className="w-full capitalize border-0 text-white bg-secondary_color font-poppins-medium font-medium rounded-md ">
          Save
        </Button>
      </Box>
    </Modal>
  );
}
