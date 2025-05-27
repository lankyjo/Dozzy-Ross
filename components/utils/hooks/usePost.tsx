import useSWRMutation from "swr/mutation";
import { post } from "../request";

export default function usePost(url: string) {
  const {
    trigger,
    data,
    error,
    isMutating: isLoading,
  } = useSWRMutation<any, Error, string, any>(url, post);

  return {
    trigger, // call trigger(value) to POST
    data,
    error,
    isLoading,
  };
}
