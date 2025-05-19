"use client";
import { getterFetcher } from "@/components/utils/request";
import { useMemo } from "react";
import useSWR from "swr";
export default function useSelectData(url: string | null) {
  const { data, isLoading, error } = useSWR(url, getterFetcher);

  const dataArr = Array.isArray(data?.data?.data)
    ? data?.data?.data
    : data?.data?.data?.data;

  const filteredData: { label: string; value: string }[] = useMemo(() => {
    return (
      dataArr?.map(({ _id, name }: { _id: string; name: string }) => ({
        value: _id,
        label: name,
      })) ?? []
    );
  }, [dataArr]);

  if (!url)
    return {} as {
      data: { label: string; value: string }[];
      isLoading: boolean;
      error: { message: string };
    };

  return {
    data: filteredData,
    isLoading,
    error,
  };
}
