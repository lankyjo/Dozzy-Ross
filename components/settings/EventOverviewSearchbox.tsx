import { Button, Divider, Text, TextInput } from "@mantine/core";
import { inputBorder } from "../global/inputs/LocalTextinput";
import { IconSearch } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useState } from "react";

export default function EventOverviewSearchbox({
  title,
  subtitle,
  handleSearch,
  placeholder,
  isSearching,
  action = "Search",
  inputValidation,
  setInputValidation,
  handleSearchUserEvent,

  isSearchEvent = false,
}: {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  handleSearch?: (e: string) => void;
  isSearching?: boolean;
  action?: string;
  inputValidation?: string;
  setInputValidation?: Dispatch<SetStateAction<string>>;
  handleSearchUserEvent?: (e: string) => void;
  isSearchEvent?: boolean;
}) {
  const [search, setSearch] = useState("");

  return (
    <>
      <p className="text-[13px] md:text-[15px] font-poppins-regular text-text_label mb-2">
        {title}
      </p>

      <div className=" ">
        <div className="w-full space-y-0 flex items-center space-x-4 md:space-x-8">
          <TextInput
            size="md"
            value={search}
            onChange={(e) => {
              if (isSearchEvent && handleSearchUserEvent) {
                handleSearchUserEvent(e.target.value);
              }
              if (setInputValidation) {
                setInputValidation("");
              }
              setSearch(e.target.value);
            }}
            className=" w-full max-w-[700px] rounded-lg"
            placeholder={placeholder}
            rightSection={<IconSearch size={30} />}
            styles={() => ({
              input: {
                width: "100%",
                maxWidth: 700,
                border: inputBorder.border,
                fontFamily: "poppins-regular",
                fontSize: 14,
                "&:focus": {
                  border: inputBorder.border,
                },
              },
            })}
          />
          {!isSearchEvent && (
            <Button
              size="md"
              bg={"#EF790D"}
              onClick={() => {
                if (handleSearch) {
                  handleSearch(search);
                  if (!isSearchEvent) {
                    setSearch("");
                  }
                }
              }}
              loading={isSearching}
              // disabled={search ? false : true}
              variant=""
              className={`bg-secondary_color text-white capitalize font-poppins-medium font-medium rounded-lg ${
                search ? "" : " pointer-events-none"
              }`}>
              {action}
            </Button>
          )}
        </div>
        <Text className="text-[10px] text-[red]  md:text-[12px] font-poppins-regular  p-2 ">
          <span className={"opacity-0"}>a</span>
          {inputValidation}
        </Text>
      </div>

      <div className={`${isSearchEvent ? "" : "mb-[20px]"}  w-fit`}>
        <p className="capitalize text-[15px] md:text-[20px] font-poppins-medium text-text_label">
          {subtitle}
        </p>

        {!isSearchEvent && <Divider size="md" />}
      </div>
    </>
  );
}
