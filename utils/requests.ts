import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.afroeventsmiami.com/api/v1";

// Set up axios instance with base URL and default headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Functions for API requests
export async function postFunc<T>({
  url,
  values,
}: {
  url: string;
  values: any;
}) {
  try {
    const response = await api.post<T>(url, values);
    return response;
  } catch (error) {
    console.error("Post request error:", error);
    throw error;
  }
}

export async function patchFunc<T>({
  url,
  values,
}: {
  url: string;
  values: any;
}) {
  try {
    const response = await api.patch<T>(url, values);
    return response;
  } catch (error) {
    console.error("Patch request error:", error);
    throw error;
  }
}

export async function getterFetcher(url: string) {
  try {
    const response = await api.get(url);
    return response;
  } catch (error) {
    console.error("Get request error:", error);
    throw error;
  }
}

export async function deleteFetcher(url: string) {
  try {
    const response = await api.delete(url);
    return response;
  } catch (error) {
    console.error("Delete request error:", error);
    throw error;
  }
}
