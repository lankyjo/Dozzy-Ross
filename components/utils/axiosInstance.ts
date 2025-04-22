import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  withCredentials: false,
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
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("error from axiosInstance: >>", error);
    const token = Cookies.get("access_token");
    if (token) {
      if (
        error?.response?.data?.errorCode?.toLowerCase() ===
        "invalid_access_token"
      ) {
      } else if (
        error?.response?.data?.errorCode?.toLowerCase() ===
        "expired_access_token"
      ) {
        // The token has expired, so log user out
        // logUserOut({ close: () => {}, setLoader: () => {} });
      } else if (
        error?.response?.data?.errorCode?.toLowerCase() ===
        "account_deactivated"
      ) {
        // user account has been deactivated
        // logUserOut({ close: () => {}, setLoader: () => {} });
      } else {
        // any other auth error, so log user out
        if (
          error?.response?.data?.errorCode?.toLowerCase() === "unauthorized"
        ) {
          //   logUserOut({ close: () => {}, setLoader: () => {} });
        }
      }
    } else {
      if (error?.response?.data?.errorCode?.toLowerCase() === "unauthorized") {
        // unauthorized error, so log user out
        // logUserOut({ close: () => {}, setLoader: () => {} });
      } else return Promise.reject(error);
    }
    // this was removed and so no response was coming if there is error
    return Promise.reject(error);
  }
);
export default axiosInstance;
