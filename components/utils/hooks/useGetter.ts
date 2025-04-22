import useSWR from "swr";
import { getterFetcher } from "../request";

export default function useGetter(url: string | null) {
  const { data, isLoading, error } = useSWR(url, getterFetcher);
  return {
    data: data?.data,
    isLoading,
    error,
  };
}
