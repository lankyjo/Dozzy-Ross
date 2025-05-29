import useSWR from "swr";
import { getterFetcher } from "../request";

export default function useGetter(url: string | null) {
  // Don't make the request if the URL is null or contains 'undefined'
  const validUrl = url && !url.includes("undefined") ? url : null;

  const { data, isLoading, error } = useSWR(validUrl, getterFetcher);
  return {
    data: data?.data,
    isLoading,
    error,
  };
}
