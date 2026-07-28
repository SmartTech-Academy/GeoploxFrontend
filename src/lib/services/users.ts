import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import api from "../api";
import { queryClient } from "../queryClient";

interface ApiResponse {
  message: string;
}

export const useGetUsers = (
  params?: any,
  options?: Omit<UseQueryOptions<AxiosResponse<any>, any>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => api.get("/dashboard/admin/users", { params }),
    ...options,
  });
};

export const useVerifyUser = (options?: UseMutationOptions<any, any, string>) => {
  return useMutation({
    mutationFn: (userCodec: string) => {
      return api.put(`/dashboard/admin/verify`, null, { params: { user_codec: userCodec } });
    },
    onSuccess: (response: AxiosResponse<ApiResponse>) => {
      toast.success(response.data.message || "User verified successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    ...options,
  });
};

export const useBlacklistUser = (options?: UseMutationOptions<any, any, string>) => {
  return useMutation({
    mutationFn: (userCodec: string) => {
      const formData = new FormData();
      formData.append("user_codec", userCodec);
      return api.post("/dashboard/admin/blacklist/user", formData);
    },
    onSuccess: (response: AxiosResponse<ApiResponse>) => {
      toast.success(response.data.message || "User blacklisted successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to blacklist user.");
    },
    ...options,
  });
};

export const useGetUserPerformance = (params: {
  period: string;
  filter: string;
  user_codec: string;
}) => {
  return useQuery({
    queryKey: ["user-performance", params],
    queryFn: () => api.get("/dashboard/admin/users/performance", { params }),
    enabled: !!params.user_codec, // Only run query if user_codec is available
  });
};
