import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.afroeventsmiami.com/api/v1";

// Log the API URL for debugging
console.log("API URL from utils/requests.ts:", process.env.NEXT_PUBLIC_API_URL);

// Set up axios instance with base URL and default headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // Add timeout to prevent long-hanging requests
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Check if we're in a browser environment before accessing localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
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
    console.log(`Making API request to: ${BASE_URL}/${url}`);
    const response = await api.get(url);
    return response;
  } catch (error: any) {
    if (error.message === "Network Error") {
      console.error(
        `Network error when fetching ${url}. API may be unreachable.`
      );
    } else {
      console.error(`Error fetching ${url}:`, error);
    }
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
