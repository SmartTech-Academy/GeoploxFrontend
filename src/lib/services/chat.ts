
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../api";
import { queryClient } from "../queryClient";

export const useGetConversations = (params: any) => {
  return useQuery({
    queryKey: ["conversations", params],
    queryFn: () => api.get("/chat/conversations", { params }),
  });
};

export const useCreateConversation = () => {
  return useMutation({
    mutationFn: (data: any) => api.post("/chat/conversations", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useDeleteConversation = () => {
  return useMutation({
    mutationFn: (id: string) => api.delete(`/chat/conversations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useMarkConversationAsRead = () => {
  return useMutation({
    mutationFn: (id: string) => api.post(`/chat/conversations/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useReportConversation = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.post(`/chat/conversations/${id}/report`, data),
  });
};

export const useSearchConversations = (query: string) => {
  return useQuery({
    queryKey: ["conversations-search", query],
    queryFn: () => api.get(`/chat/conversations/search?q=${query}`),
    enabled: !!query,
  });
};

export const useGetMessages = (conversationId: string, params: any) => {
  return useQuery({
    queryKey: ["messages", conversationId, params],
    queryFn: () =>
      api.get(`/chat/conversations/${conversationId}/messages`, { params }),
  });
};

export const useSendMessage = (conversationId: string) => {
  return useMutation({
    mutationFn: (data: any) =>
      api.post(`/chat/conversations/${conversationId}/messages`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    },
  });
};
