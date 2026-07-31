import { useMutation } from "@tanstack/react-query";
import api from "../api";
import { queryClient } from "../queryClient";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: any) => api.post("/auth/login", data),
    onSuccess: (data) => {
      const responseData = data.data?.data;
      const token = responseData?.access_token;
      // Token must be stored before invalidating queries: any query (like the profile fetch)
      // that re-runs as a result of the invalidation needs to see the new token immediately,
      // not fire disabled/unauthenticated because it read localStorage a moment too early.
      if (token) {
        localStorage.setItem("token", token);
      }
      queryClient.invalidateQueries();
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: any) => api.post("/auth/register", data),
  });
};

export const useOverrideRegister = () => {
  return useMutation({
    mutationFn: (data: any) => api.post("/auth/override/register", data),
  });
};

export const useVaidateRegistrationData = () => {
  return useMutation({
    mutationFn: (data: any) => api.post("/auth/validate/registration-data", data),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.clear();
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: any) => api.post("/auth/forgot-password", data),
  });
};

export const useResend = () => {
  return useMutation({
    mutationFn: (data: any) => api.post("/auth/resend", data),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: any) => api.post("/auth/reset-password", data),
  });
};

export const useVerify = () => {
  return useMutation({
    mutationFn: (data: any) => api.post("/auth/verify", data),
  });
};
