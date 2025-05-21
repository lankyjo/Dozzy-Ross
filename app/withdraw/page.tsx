"use client";
import {
  Box,
  Button,
  Container,
  Divider,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import GoBack from "@/components/icons/GoBackIcon";
import { useForm } from "@mantine/form";

import { mutate } from "swr";
import { useContext } from "react";
import { ActionIcon, PinInput } from "@mantine/core";
import GoBackIcon from "@/components/icons/GoBackIcon";
import { useRouter, useSearchParams } from "next/navigation";
import { TempValueContext } from "@/components/utils/contextAPI/TempValueContext";
import { postFunc } from "@/components/utils/request";
import {
  customErrorFunc,
  customNotification,
  defaultCurrency,
  defaultNumber,
  isEmpty,
} from "@/components/utils/contextAPI/helperFunctions";
import SearchDialog from "@/components/modal/SearchDialog";
import useGetter from "@/components/utils/hooks/useGetter";
import BankDetails from "@/components/withdrawal/BankDetails";
import WithdrawalMethod from "@/components/withdrawal/WithdrawalMethod";

function VerifyOTP({
  withdrawal,
  email,
  close,
  method,
  setMethod,
  form,
}: {
  withdrawal: Withdrawal;
  email: string;
  close: Dispatch<SetStateAction<boolean>>;
  form: any;
  method: {
    withdrawalType: string;
    withdrawalMethod: string;
  };
  setMethod: (method: {
    withdrawalType: string;
    withdrawalMethod: string;
  }) => void;
}) {
  const [state, dispatch] = useState({
    payload: false,
    inputValue: "",
  });

  const [isLoadingResend, setIsLoadingResend] = useState(false);
  const [showDialogue, setShowDialog] = useState(false);
  const [showEventDialogue, setshowEventDialogue] = useState({
    success: false,
    message: "",
    error: false,
  });
  const [isWithraw, setiswithraw] = useState("");
  const searchParams = new URLSearchParams(window.location.search);

  const id = searchParams.get("event") ?? "";
  const setVal = useContext(TempValueContext).setVal;

  async function handleVerifyOTP() {
    dispatch({ ...state, payload: true });

    try {
      const res = await postFunc({
        values: {
          ...withdrawal,
          otp: Number(state.inputValue),
        },
        url: "withdrawal-requests",
      });

      if (res?.data?.success) {
        form.reset();
        setVal("");
        mutate(`event/stats/organizer?eventId=${id}`);
        setiswithraw(`profile/${id}?admin`);
        setshowEventDialogue({
          error: false,
          success: true,
          message:
            "Your withdrawal request is being processed. You'll receive an email confirmation as soon as the request is approved.",
        });
        dispatch({ ...state, payload: false });
        setShowDialog(true);
      } else {
        if (res?.data?.message) {
          customNotification("warning", res.data.message, "secondary_color.0");
        }
      }
    } catch (error: any) {
      // setiswithraw("");
      setshowEventDialogue({
        error: true,
        success: false,
        message: error?.response?.data?.message as string,
      });
      setShowDialog(true);
    } finally {
      dispatch({ ...state, payload: false });
    }
  }

  async function handleResendEmailOTP() {
    setIsLoadingResend(true);
    try {
      const res = await postFunc({
        url: "otp/request",
        values: {
          email: email,
          type: "withdrawal",
        },
      });

      if (res?.data?.success) {
        customNotification("success", "OTP sent", "primary_color.0");
      } else {
        customNotification("warning", res?.data?.message, "secondary_color.0");
      }
    } catch (error: any) {
      customErrorFunc(error);
    } finally {
      setIsLoadingResend(false);
    }
  }

  return (
    <main>
      <div className="w-full flex h-[calc(100vh-150px)] lg:space-x-9 justify-center items-center px-4">
        <div className="w-full md:max-w-[664px] bg-white p-[20px] md:p-[45px_45px_20px_45px] rounded-md">
          <div
            onClick={() => {
              setMethod(method);
              close(false);
            }}
            className="w-[40px] cursor-pointer">
            <GoBackIcon />
          </div>

          <Box className="flex flex-col justify-center items-center">
            <Text
              c={"#171717"}
              fw={"bolder"}
              className="text-primary_color capitalize font-poppins-medium  md:text-[25px] text-[20px] ">
              Enter the verification code
            </Text>
            <Text
              c={"#171717"}
              className="  text-[#80868C] text-center  font-poppins-regular  md:text-[16px]">
              Enter{" "}
              <span className="lowercase">
                the verification code sent to {` ${email}`} to complete your
                withdrawal
              </span>
            </Text>
          </Box>
          <div className="w-full max-w-[574px] mx-auto flex justify-center flex-col">
            <PinInput
              mb={40}
              type="number"
              mx={"auto"}
              aria-label="One time code"
              c={"#171717"}
              fw={"bold"}
              oneTimeCode
              value={state.inputValue}
              onChange={(e) => dispatch({ ...state, inputValue: e })}
              length={5}
              styles={() => ({
                input: {
                  //borderColor: theme.colors.grey_70[0],
                  borderTop: "none",
                  color: "#171717",
                  borderLeft: "none",
                  borderRight: "none",
                  backgroundColor: "transparent",
                  fontFamily: "poppins-regular",
                  fontSize: 14,
                  width: "100%",
                  height: 80,
                  borderRadius: 0,
                  "&:focus": {
                    //   borderColor: theme.colors.grey_70[0],
                  },
                },
              })}
            />
            <Group mt={16} mb={15} gap={10} justify="center">
              <p className="text-base_grey text-sm font-poppins-medium text-[#171717]">
                Didn&apos;t receive code?
              </p>
              <ActionIcon
                onClick={handleResendEmailOTP}
                loading={isLoadingResend}
                color="secondary_color.0"
                variant="transparent"
                w={80}
                fw={"bold"}
                c={"#171717"}
                className="capitalize  w-full">
                Resend
              </ActionIcon>
            </Group>
            <Button
              onClick={handleVerifyOTP}
              loading={state.payload}
              disabled={state?.inputValue?.length < 5}
              color="white"
              c={"white"}
              type="button"
              fullWidth
              bg={"#EF790D"}
              variant="white"
              className={`bg-secondary_color mb-4 h-[50px] font-poppins-medium font-medium text-lg capitalize text-white rounded-lg  ${
                state.payload ? " pointer-events-none" : ""
              }`}>
              Continue
            </Button>
          </div>
        </div>
      </div>

      <SearchDialog
        close={setShowDialog}
        opened={showDialogue}
        message={showEventDialogue}
        isWithdrawal={isWithraw}
      />
    </main>
  );
}

function Withdraw() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const id = searchParams.get("event") ?? "";
  const currencyId = searchParams.get("currency") ?? "";

  const [otpSuccess, setOtpSuccess] = useState(false);
  const [withdrawalInut, setWithdrawalInput] = useState({} as Withdrawal);
  const { val, setVal } = useContext(TempValueContext);
  const { data } = useGetter(id ? `event/organizer/single?id=${id}` : null);
  const { data: paymentData } = useGetter(
    currencyId ? `withdrawal-method?currencyId=${currencyId}` : null
  );
  const { data: user } = useGetter(`user`);
  const [showDialogue, setShowDialog] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showEventDialogue, setshowEventDialogue] = useState({
    success: false,
    message: "",
    error: false,
  });
  const form = useForm({
    initialValues: {
      amount: "",
    },
  });

  const [method, setMethod] = useState({
    withdrawalType: "",
    withdrawalMethod: "",
  });

  const withdrawalMethod = useMemo(() => {
    if (method.withdrawalMethod) {
      return paymentData?.data?.find(
        (paymentMethod: any) => paymentMethod?._id === method?.withdrawalMethod
      );
    } else {
      return {};
    }
  }, [method, paymentData]);

  useEffect(() => {
    withdrawalMethod.inputFields?.forEach(({ name }: { name: string }) => {
      form.setFieldValue(`${name}`, "");
    });
    form.setFieldValue("amount", data?.data?.availableBalanceAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdrawalMethod, data?.data?.availableBalanceAmount]);

  const makeWithdrawal = async () => {
    let inputFields: WithdrawalInput[] = [];

    Object.entries(form.values as Record<string, string>).forEach(
      ([key, value]) => {
        if (key !== "amount") {
          inputFields = [...inputFields, { name: key, value }];
        }
      }
    );

    if (val?.type?.toLowerCase() === "referral") {
      setWithdrawalInput({
        type: "referral",
        withdrawalMethodId: method?.withdrawalMethod,
        amount: Number(val?.amount),
        currencyName: val?.currency?.name,
        inputFields,
      });
    } else {
      setWithdrawalInput({
        eventId: id,
        withdrawalMethodId: method?.withdrawalMethod,
        amount: Number(form?.values?.amount),
        inputFields,
      });
    }

    try {
      setLoading(true);
      const res = await postFunc({
        url: "otp/request",
        values: {
          email: user?.data?.email,
          type: "withdrawal",
        },
      });

      if (res?.data?.success) {
        setOtpSuccess(true);
      }
    } catch (error: any) {
      setshowEventDialogue({
        error: true,
        success: false,
        message: error?.response?.data?.message as string,
      });

      setShowDialog(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="w-full min-h-screen   ">
        {otpSuccess ? (
          <Container size={2000} px={0}>
            <VerifyOTP
              email={user?.data?.email}
              withdrawal={withdrawalInut}
              close={setOtpSuccess}
              method={method}
              setMethod={setMethod}
              form={form}
            />
          </Container>
        ) : (
          <Container size={2000} px={0}>
            <div className="w-full flex h-[calc(100vh-150px)] lg:space-x-9 justify-center items-center px-4">
              <div className="w-full md:max-w-[664px] bg-white p-[20px] md:p-[45px_45px_20px_45px] rounded-md">
                <form
                  onSubmit={form.onSubmit(() => {
                    makeWithdrawal();
                  })}
                  className="">
                  <div
                    onClick={() => {
                      router.back();
                      setVal("");
                    }}
                    className=" cursor-pointer w-[40px]">
                    <GoBack />
                  </div>
                  <Box className="flex flex-col justify-center items-center">
                    <Text
                      fw={"bolder"}
                      c={"#171717"}
                      className="text-[#171717] capitalize font-poppins-regular text-[14px]  md:text-[15px]">
                      Available Balance
                    </Text>
                    <Text
                      fw={"bold"}
                      c={"#171717"}
                      className="text-primary_color capitalize font-poppins-semibold text-[32px] mb-5">
                      {(data?.data?.currency?.symbol ??
                        val?.currency?.symbol) ||
                        defaultCurrency}
                      {Math.round(
                        (data?.data?.availableBalanceAmount ?? defaultNumber) ||
                          val?.amount ||
                          0
                      )?.toLocaleString()}
                    </Text>
                  </Box>

                  <Stack gap={10} bg={"white"}>
                    <Group justify="apart">
                      <WithdrawalMethod
                        setMethod={setMethod}
                        methods={paymentData?.data}
                        amount={data?.availableBalanceAmount}
                        method={method}
                        form={form}
                      />
                    </Group>

                    <Divider
                      my="xs"
                      label="Enter details"
                      labelPosition="center"
                      styles={() => ({
                        label: {
                          fontSize: 12,
                          fontWeight: 400,
                          fontFamily: "poppins-regular",
                          color: "#171717",
                        },
                      })}
                    />
                    <Box>
                      {method?.withdrawalMethod && (
                        <BankDetails
                          form={form}
                          withdrawalMethod={withdrawalMethod}
                        />
                      )}
                    </Box>

                    <div className="mt-4">
                      {!isEmpty(paymentData?.data) && (
                        <Button
                          size="md"
                          color="gray.0"
                          bg={"#EF790D"}
                          type="submit"
                          fullWidth
                          loading={loading}
                          disabled={
                            Number(data?.availableBalanceAmount) < 1 ||
                            isEmpty(withdrawalMethod)
                          }
                          variant="white"
                          className={`bg-secondary_color font-poppins-regular text-md capitalize text-white rounded-lg ${
                            loading ? " pointer-events-none" : ""
                          }`}>
                          Proceed
                        </Button>
                      )}

                      {isEmpty(paymentData) && (
                        <Button
                          size="md"
                          onClick={() => router.push("/contact-us")}
                          bg="#171717"
                          c="white"
                          type="submit"
                          fullWidth
                          variant="white"
                          className="bg-secondary_color font-poppins-regular text-lg capitalize text-white rounded-lg">
                          Contact us
                        </Button>
                      )}
                    </div>
                  </Stack>
                </form>
              </div>
            </div>
          </Container>
        )}
      </main>

      <SearchDialog
        close={setShowDialog}
        opened={showDialogue}
        message={showEventDialogue}
      />
    </>
  );
}

export default Withdraw;
