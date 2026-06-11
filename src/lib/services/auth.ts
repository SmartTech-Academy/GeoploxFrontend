import { useMutation } from "@tanstack/react-query";
import api from "../api";
import { queryClient } from "../queryClient";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: any) => api.post("/auth/login", data),
    onSuccess: (data) => {
      const responseData = data.data?.data;
      const token = responseData?.access_token;
      queryClient.invalidateQueries(); // Invalidate all queries to force a refetch
      if (token) {
        localStorage.setItem("token", token);
      }
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
