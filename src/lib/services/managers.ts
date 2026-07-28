import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import api from "../api";
import { queryClient } from "../queryClient";

interface ApiResponse {
  message: string;
}

export const useGetManagers = (params?: any) => {
  return useQuery({
    queryKey: ["managers", params],
    queryFn: () => api.get("/dashboard/managers/account-data/fetcher", { params }),
  });
};

export const useGetOwnersAndDevelopers = () => {
  return useQuery({
    queryKey: ["owners-developers"],
    queryFn: () => api.get("/dashboard/managers/fetch/owners-developers"),
  });
};

export const useGetManagersAssignedUsers = (managerId?: string) => {
  return useQuery({
    queryKey: ["manager-assigned-users", managerId],
    queryFn: async () => {
      const formData = new FormData();
      formData.append("manager_id", managerId || "");
      return api.post("/dashboard/managers/view/assigned-users", formData);
    },
    enabled: !!managerId,
  });
};

type RegisterManagerPayload = {
  fname: string;
  lname: string;
  phone: string;
  email: string;
  username: string;
  password: string;
};

export const useRegisterManager = (
  options?: UseMutationOptions<any, any, RegisterManagerPayload>,
) => {
  return useMutation({
    ...options,
    mutationFn: async (payload: RegisterManagerPayload) => {
      const formData = new FormData();
      formData.append("fname", payload.fname);
      formData.append("lname", payload.lname);
      formData.append("phone", payload.phone);
      formData.append("email", payload.email);
      formData.append("username", payload.username);
      formData.append("password", payload.password);
      return api.post("/dashboard/admin/managers-registration", formData);
    },
    onSuccess: (response: AxiosResponse<any>, _variables, _context) => {
      toast.success(response.data?.message || "Manager registration successful.");
      queryClient.invalidateQueries({ queryKey: ["managers"] });
    },
  });
};

export const useGetOwnersDevelopers = (
  params?: any,
  options?: Omit<UseQueryOptions<AxiosResponse<any>, any>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["owners-developers", params],
    queryFn: () => api.get("/dashboard/managers/fetch/owners-developers", { params }),
    ...options,
  });
};

type AssignUsersPayload = { manager_id: string; user_ids: string[] };

export const useAssignUsersToManager = (
  options?: UseMutationOptions<any, any, AssignUsersPayload>,
) => {
  return useMutation({
    ...options,
    mutationFn: (payload: AssignUsersPayload) => {
      return api.post("/dashboard/managers/assign-users", payload);
    },
    onSuccess: (response: AxiosResponse<ApiResponse>, _variables, _context) => {
      toast.success(response.data?.message || "Users successfully assigned to manager.");
      queryClient.invalidateQueries({ queryKey: ["manager-assigned-users"] });
    },
  });
};

type AssignRegionPayload = {
  manager_id: string;
  state: string;
  city: string;
};

export const useAssignRegionToManager = () => {
  return useMutation({
    mutationFn: (payload: AssignRegionPayload) => {
      // Ensure manager_id is sent correctly.
      // If your backend expects the encrypted string, ensure you pass the raw ID if the hook handles encryption,
      // or pass the encrypted string if that's what 'managerId' prop contains.
      // Based on your snippet, it looks like it expects the encrypted string in 'manager_id'.
      return api.post("/dashboard/managers/assign-region", payload);
    },
    onSuccess: (response: AxiosResponse<ApiResponse>) => {
      toast.success(response.data?.message || "Region successfully assigned to manager.");
      queryClient.invalidateQueries({ queryKey: ["manager-assigned-users"] }); // Or whatever your region query key is
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to assign region.");
    },
  });
};

type ToggleManagerAccessPayload = { manager_codec: string; managers_access_toggle: "yes" | "no" };

export const useToggleManagerAccess = (
  options?: UseMutationOptions<any, any, ToggleManagerAccessPayload>,
) => {
  return useMutation({
    ...options,
    mutationFn: async (payload: ToggleManagerAccessPayload) => {
      const formData = new FormData();
      formData.append("manager_codec", payload.manager_codec);
      formData.append("managers_access_toggle", payload.managers_access_toggle);
      return api.post("/dashboard/managers/access/toggler", formData);
    },
    onSuccess: (response: AxiosResponse<ApiResponse>, _variables, _context) => {
      toast.success(response.data?.message || "Manager access updated.");
      queryClient.invalidateQueries({ queryKey: ["managers"] });
    },
  });
};

type ChangeManagerPasswordPayload = { current_password: string; new_password: string };

export const useChangeManagerPassword = (
  options?: UseMutationOptions<any, any, ChangeManagerPasswordPayload>,
) => {
  return useMutation({
    ...options,
    mutationFn: async (payload: ChangeManagerPasswordPayload) => {
      const formData = new FormData();
      formData.append("current_password", payload.current_password);
      formData.append("new_password", payload.new_password);
      return api.post("/dashboard/managers/password/changer", formData);
    },
    onSuccess: (response: AxiosResponse<ApiResponse>, _variables, _context) => {
      toast.success(response.data?.message || "Password updated successfully.");
    },
  });
};
