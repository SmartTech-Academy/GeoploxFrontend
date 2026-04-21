import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { sendTelegramError } from "./utils";

const BASE_URL = "https://api.geoplox.com/api/v1";
const publicPages = [
  "/short-let",
  "/for-rent",
  "/for-sale",
  "/blog",
  "/pricing",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/about",
  "/contact",
  "/joint-venture",
];

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: any) => {
  return response;
};

const onResponseError = async (error: AxiosError): Promise<AxiosError | Error> => {
  let message = "Unknown error";
  if (error.response) {
    const { status, data, config } = error.response;
    const errorMessage = (data as { message?: string })?.message;

    message = `
🚨 API Error
URL: ${config?.url}
Method: ${config?.method}
Status: ${status}
Message: ${errorMessage || "No message"}
Time: ${new Date().toISOString()}
    `;
    const isDev = process.env.NODE_ENV === "development";
    if (!isDev) await sendTelegramError(message);

    if (status === 401) {
      if (
        errorMessage ===
        "Unauthorized: You do not have the authorization to perform this action, please wait until admin verifies and approve your account"
      ) {
        return Promise.reject(error);
      }

      localStorage.removeItem("token");
      const currentLocation = window.location.pathname;

      const isPublicPage = publicPages.some(
        (route) => currentLocation === route || currentLocation.startsWith(`${route}/`),
      );
      const isHomePage = currentLocation === "/";

      // Redirect only if it's NOT a public page AND NOT the home page
      if (!isPublicPage && !isHomePage) {
        window.location.href = "/unauthorized";
      }

      return Promise.reject(new Error("Unauthenticated. Please log in again."));
    }

    if (status === 403) {
      return Promise.reject(
        new Error("Access forbidden. You do not have permission to perform this action."),
      );
    }

    if (status === 413) {
      return Promise.reject(
        new Error("The file you uploaded is too large. Please upload a smaller file."),
      );
    }

    if (status === 504) {
      return Promise.reject(
        new Error("Request timed out. Please try again or check your connection."),
      );
    }

    // if (status >= 500) {
    //   return Promise.reject(new Error('Sorry, a server error occurred. Please try again later.'));
    // }
  } else if (error.request) {
    // The request was made but no response was received
    return Promise.reject(
      new Error("No response from server. Please check your network connection."),
    );
  }
  return Promise.reject(error);
};

api.interceptors.request.use(onRequest, onRequestError);
api.interceptors.response.use(onResponse, onResponseError);

export default api;
