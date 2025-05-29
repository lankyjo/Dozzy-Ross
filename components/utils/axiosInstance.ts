import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { AuthConfirmModal } from "../modal/AuthConfirmModal";
import { logUserOut } from "./contextAPI/helperFunctions";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  withCredentials: false,
  timeout: 15000, // Add timeout to prevent long-hanging requests
});

axiosInstance.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  function (error) {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle network errors specially
    if (error.message === "Network Error") {
      console.error("Network error detected. API may be unreachable.");
      // You can add custom handling here, like showing a toast notification
      return Promise.reject(error);
    }

    const token = Cookies.get("access_token");
    if (token) {
      if (
        error?.response?.data?.errorCode?.toLowerCase() ===
        "invalid_access_token"
      ) {
        await AuthConfirmModal();
      } else if (
        error?.response?.data?.errorCode?.toLowerCase() ===
        "expired_access_token"
      ) {
        // The token has expired, so log user out
        logUserOut({ close: () => {}, setLoader: () => {} });
      } else if (
        error?.response?.data?.errorCode?.toLowerCase() ===
        "account_deactivated"
      ) {
        // user account has been deactivated
        logUserOut({ close: () => {}, setLoader: () => {} });
      } else {
        // any other auth error, so log user out
        if (
          error?.response?.data?.errorCode?.toLowerCase() === "unauthorized"
        ) {
          logUserOut({ close: () => {}, setLoader: () => {} });
        }
      }
    } else {
      if (error?.response?.data?.errorCode?.toLowerCase() === "unauthorized") {
        // unauthorized error, so log user out
        logUserOut({ close: () => {}, setLoader: () => {} });
      } else return Promise.reject(error);
    }
    // this was removed and so no response was coming if there is error
    return Promise.reject(error);
  }
);
export default axiosInstance;
