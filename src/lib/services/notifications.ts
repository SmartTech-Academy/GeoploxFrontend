import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import api from "../api";
import { queryClient } from "../queryClient";

import { AxiosResponse } from "axios";
import { NotificationsResponse } from "@/lib/notifications";

interface UnreadCountResponse {
  status: string;
  message: string;
  data: { unread_count: number; };
}

export const useGetNotifications = (params: { per_page?: number } = {}) => {
  return useInfiniteQuery({
    queryKey: ['notifications', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response: AxiosResponse<NotificationsResponse> = await api.get('/dashboard/alert/notifications', {
        params: { ...params, page: pageParam },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.data.meta.current_page < lastPage.data.meta.last_page) {
        return lastPage.data.meta.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

export const useGetUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ["unread-notifications-count"],
    queryFn: async (): Promise<AxiosResponse<UnreadCountResponse>> => api.get("/dashboard/alert/notifications/unread-count"),
    select: (data) => data.data.data.unread_count,
    refetchInterval: 60000, // Refetch every 60 seconds
  });
};

export const useMarkNotificationAsRead = () => {
  return useMutation({
    mutationFn: (id: string) => api.put(`/dashboard/alert/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
    },
  });
};


export const useMarkAllNotificationsAsRead = () => {
  return useMutation({
    mutationFn: () => api.put("/dashboard/alert/notifications/mark-all-read"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
    },
  });
};

export const useDeleteNotification = () => {
  return useMutation({
    mutationFn: (id: string) => api.delete(`/dashboard/alert/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
    },
  });
};

export const useBulkDeleteNotifications = () => {
  return useMutation({
    mutationFn: (ids: string[]) =>
      api.delete("/dashboard/alert/bulk-delete/notifications", { data: { ids } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
    },
  });
};
