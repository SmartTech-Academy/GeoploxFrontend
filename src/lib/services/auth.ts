import { useMutation } from "@tanstack/react-query";
import api from "../api";
import { queryClient } from "../queryClient";
import { setStoredToken, clearStoredToken } from "../auth-token";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: any) => api.post("/auth/login", data),
    onSuccess: (data) => {
      const responseData = data.data?.data;
      const token = responseData?.access_token;
      // Token must be stored before invalidating queries: any query (like the profile fetch)
      // that re-runs as a result of the invalidation needs to see the new token immediately,
      // not fire disabled/unauthenticated because it read localStorage a moment too early.
      // setStoredToken also announces the change so already-mounted components (header/nav)
      // relying on useGetProfileData's reactive token read pick it up immediately, even when
      // login happens in-place (a modal) with no navigation/reload to force a fresh render.
      if (token) {
        setStoredToken(token);
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
      clearStoredToken();
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
