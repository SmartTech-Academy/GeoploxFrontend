import { useMutation, useQuery, UseMutationOptions } from "@tanstack/react-query";

import { toast } from "sonner";
import { AxiosResponse } from "axios";
import api from "../api";
import { queryClient } from "../queryClient";

interface ApiResponse {
  message: string;
}

export const useGetApprovals = (params?: any) => {
  return useQuery({
    queryKey: ["approvals", params],
    queryFn: () => api.get("/dashboard/admin/fetch/approvals", { params }),
  });
};

export const useGetDeclinedItems = (params?: any) => {
  return useQuery({
    queryKey: ["declined-approvals", params],
    queryFn: () => api.get("/dashboard/admin/fetch/declined", { params }),
  });
};

export const useVerifyUser = (options?: UseMutationOptions<any, any, string>) => {
  const { onSuccess, onError, ...mutationOptions } = options ?? {};

  return useMutation({
    mutationFn: (userCodec: string) => {
      return api.put(`/dashboard/admin/verify?user_codec=${userCodec}`);
    },
    onSuccess: async (response: AxiosResponse<ApiResponse>, variables, context) => {
      toast.success(response.data.message || "User verified successfully!");
      await queryClient.invalidateQueries({ queryKey: ["approvals"] });
      await onSuccess?.(response, variables, context, undefined as never);
    },
    onError: async (error, variables, context) => {
      await onError?.(error, variables, context, undefined as never);
    },
    ...mutationOptions,
  });
};

export const useApproveRequest = (options?: UseMutationOptions<any, any, string>) => {
  const { onSuccess, onError, ...mutationOptions } = options ?? {};

  return useMutation({
    mutationFn: (propertyId: string) => {
      const formData = new FormData();
      formData.append("property_id", propertyId);
      return api.put("/dashboard/admin/approver", formData);
    },
    onSuccess: async (response: AxiosResponse<ApiResponse>, variables, context) => {
      toast.success(response.data.message || "Request approved successfully!");
      await queryClient.invalidateQueries({ queryKey: ["approvals"] });
      await onSuccess?.(response, variables, context, undefined as never);
    },
    onError: async (error, variables, context) => {
      await onError?.(error, variables, context, undefined as never);
    },
    ...mutationOptions,
  });
};

type DeclineRequestPayload = {
  id: string;
  reason: string;
  type: "KYC" | "Listing";
};

export const useDeclineRequest = (options?: UseMutationOptions<any, any, DeclineRequestPayload>) => {
  const { onSuccess, onError, ...mutationOptions } = options ?? {};

  return useMutation({
    mutationFn: (data: DeclineRequestPayload) => {
      if (data.type === "KYC") {
        return api.put("/dashboard/admin/decline/verify", null, {
          params: { user_codec: data.id, reason: data.reason },
        });
      }

      const formData = new FormData();
      formData.append("property_id", data.id);
      formData.append("reason", data.reason);
      return api.put("/dashboard/admin/decline", formData);
    },
    onSuccess: async (response: AxiosResponse<ApiResponse>, variables, context) => {
      toast.success(response.data.message || "Request declined successfully!");
      await queryClient.invalidateQueries({ queryKey: ["approvals"] });
      await onSuccess?.(response, variables, context, undefined as never);
    },
    onError: async (error, variables, context) => {
      await onError?.(error, variables, context, undefined as never);
    },
    ...mutationOptions,
  });
};
