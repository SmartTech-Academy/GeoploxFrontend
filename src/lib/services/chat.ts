import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import api from '../api';
import { queryClient } from '../queryClient';

export const useGetConversations = (params: { per_page?: number; [key: string]: any }) => {
  return useInfiniteQuery({
    queryKey: ['conversations', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get('/dashboard/chat/conversations', {
        params: { ...params, page: pageParam },
      });
      return response.data.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page < lastPage.meta.last_page) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

export const useCreateConversation = () => {
  return useMutation({
    mutationFn: (data: { participant_user_id: string; subject?: string }) => {
      const formData = new FormData();
      formData.append("participant_user_id", data.participant_user_id);
      formData.append("subject", data.subject || "Chat");
      formData.append("type", "private");
      return api.post("/dashboard/chat/conversations", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};


export const useDeleteConversation = () => {
  return useMutation({
    mutationFn: (id: string) => api.delete(`/dashboard/chat/conversations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useMarkConversationAsRead = () => {
  return useMutation({
    mutationFn: (id: string) => api.post(`/dashboard/chat/conversations/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useReportConversation = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.post(`/dashboard/chat/conversations/${id}/report`, data),
  });
};

export const useSearchConversations = (query: string) => {
  return useQuery({
    queryKey: ['conversations-search', query],
    queryFn: () => api.get(`/dashboard/chat/conversations/search?q=${query}`),
    enabled: !!query,
  });
};

export const useGetMessages = (conversationId: string | number | null, params: { per_page?: number }) => {
  return useInfiniteQuery({
    queryKey: ['messages', conversationId, params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get(`/dashboard/chat/conversations/${conversationId}/messages`, {
        params: { ...params, page: pageParam },
      });
      return response.data; // The whole response is needed for messages
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page < lastPage.meta.last_page) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
    enabled: !!conversationId,
    initialPageParam: 1,
  });
};

export const useSendMessage = (conversationId: string) => {
  return useMutation({
    mutationFn: (data: any) => api.post(`/dashboard/chat/conversations/${conversationId}/messages`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
  });
};

export const useGetUnreadMessageCount = () => {
  return useQuery({
    queryKey: ['unread-message-count'],
    queryFn: () => api.get('/chat/messages/unread-count'),
  });
};
