import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../api";
import { queryClient } from "../queryClient";

export const useSetAccountType = () => {
  return useMutation({
    mutationFn: (data: any) => api.post("/dashboard/onboarding/account-type?update=update", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-summary"] });
    },
  });
};

export const useSetPersonalInformation = () => {
  return useMutation({
    mutationFn: (data: any) => {
      const headers = data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
      const imageType = data instanceof FormData ? "file" : "binary";
      const url = `/dashboard/onboarding/personal?dimension=300by300&edit_image=resize-only&image_type=${imageType}&update=update`;

      return api.post(url, data, {
        headers,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-summary"] });
    },
  });
};

export const useSetBusinessInformation = () => {
  return useMutation({
    mutationFn: (data: any) => {
      const headers = data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
      const imageType = data instanceof FormData ? "file" : "binary";
      const url = `/dashboard/onboarding/business?dimension=300by300&edit_image=resize-only&image_type=${imageType}&update=update`;

      return api.post(url, data, {
        headers,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-summary"] });
    },
  });
};

export const useUploadOwnerKycDocuments = () => {
  return useMutation({
    mutationFn: (data: any) =>
      api.post(
        "/dashboard/onboarding/owner_kycUpload?update=update", // Endpoint for property owner
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-summary"] });
    },
  });
};
export const useUploadKycDocuments = () => {
  return useMutation({
    mutationFn: (data: any) =>
      api.post(
        "/dashboard/onboarding/kyc?dimension=300by300&edit_image=resize-only&image_type=binary&update=update",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-summary"] });
    },
  });
};

export const useGetOnboardingSummary = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["onboarding-summary"],
    queryFn: () => api.get("/dashboard/onboarding/summary"),
    ...options,
  });
};

export const useCompleteOnboarding = () => {
  return useMutation({
    mutationFn: () => api.post("/dashboard/onboarding/complete"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-summary"] });
    },
  });
};

export const useSubscribeToPlan = () => {
  return useMutation({
    mutationFn: (data: any) => api.post("/dashboard/onboarding/subscribe?update=update", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-summary"] });
    },
  });
};
