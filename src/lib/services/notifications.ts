
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../api";
import { queryClient } from "../queryClient";

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.get("/alert/notifications"),
  });
};

export const useGetUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ["unread-notifications-count"],
    queryFn: () => api.get("/alert/notifications/unread-count"),
  });
};

export const useMarkNotificationAsRead = () => {
  return useMutation({
    mutationFn: (id: string) => api.put(`/alert/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  return useMutation({
    mutationFn: () => api.put("/alert/notifications/mark-all-read"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
    },
  });
};

export const useDeleteNotification = () => {
  return useMutation({
    mutationFn: (id: string) => api.delete(`/alert/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
    },
  });
};

export const useBulkDeleteNotifications = () => {
  return useMutation({
    mutationFn: (ids: string[]) =>
      api.delete("/alert/bulk-delete/notifications", { data: { ids } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
    },
  });
};
