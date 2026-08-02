import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../api";
import { queryClient } from "../queryClient";
import { LastMessage } from "@/components/dashboard/messaging/chat";

export const useGetConversations = (params: { per_page?: number; [key: string]: any }) => {
  return useInfiniteQuery({
    queryKey: ["conversations", params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get("/dashboard/chat/conversations", {
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
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
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
    // Optimistically strip the conversation out of every cached conversations list the moment
    // delete is clicked, instead of waiting on a server round-trip + refetch - that round-trip
    // was also hitting a backend cache (10s TTL) that a mismatched cache key meant never actually
    // got invalidated, so the deleted chat could visibly linger for up to 10s. Rolls back on
    // failure, and still refetches on settle so the list is eventually fully authoritative.
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["conversations"] });
      const previous = queryClient.getQueriesData({ queryKey: ["conversations"] });

      queryClient.setQueriesData({ queryKey: ["conversations"] }, (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: (page.data ?? []).filter((c: any) => String(c.id) !== String(id)),
          })),
        };
      });

      return { previous };
    },
    onError: (_err, _id, context) => {
      context?.previous?.forEach(([key, data]: any) => {
        queryClient.setQueryData(key, data);
      });
      toast.error("Failed to delete conversation. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useMarkConversationAsRead = () => {
  return useMutation({
    mutationFn: (id: string) => api.post(`/dashboard/chat/conversations/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
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
    queryKey: ["conversations-search", query],
    queryFn: () => api.get(`/dashboard/chat/conversations/search?q=${query}`),
    enabled: !!query,
  });
};

export const useGetMessages = (
  conversationId: string | number | null,
  params: { per_page?: number },
) => {
  return useInfiniteQuery({
    queryKey: ["messages", conversationId, params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get(`/dashboard/chat/conversations/${conversationId}/messages`, {
        params: { ...params, page: pageParam },
      });
      return response.data;
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

interface PollMessagesResponse {
  status: string;
  message: string;
  data: {
    messages: LastMessage[];
    last_id: number;
  };
}

/**
 * Lightweight real-time-ish polling for an open conversation. Hits a dedicated cheap backend
 * endpoint (indexed `id > after_id` lookup, capped at 50 rows) instead of re-fetching the full
 * paginated message list on a timer - keeps per-poll payload near-empty on the common case of
 * "nothing new yet", which matters on shared hosting where we want polling to look and cost like
 * ordinary browser traffic, not a heavy repeated query.
 *
 * The query key intentionally excludes `afterId` so this stays ONE continuous polling query
 * (stable interval) rather than restarting - to say nothing of racing to refetch - every time the
 * cursor advances; `afterId` is simply read fresh from the latest render on each tick.
 */
export const useGetNewMessages = (
  conversationId: string | number | null,
  afterId: number,
  enabled: boolean,
) => {
  // afterId is deliberately left out of the key; see the function doc comment above for why.
  // oxlint-disable-next-line @tanstack/query/exhaustive-deps
  return useQuery({
    queryKey: ["messages-poll", conversationId],
    queryFn: async (): Promise<PollMessagesResponse["data"]> => {
      const response = await api.get<PollMessagesResponse>(
        `/dashboard/chat/conversations/${conversationId}/messages/poll`,
        { params: { after_id: afterId } },
      );
      return response.data.data;
    },
    enabled: enabled && !!conversationId,
    refetchInterval: 3000,
    refetchIntervalInBackground: false,
  });
};

export const useSendMessage = (conversationId: string | number) => {
  return useMutation({
    mutationFn: (data: any) =>
      api.post(`/dashboard/chat/conversations/${conversationId}/messages`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useGetUnreadMessageCount = () => {
  return useQuery({
    queryKey: ["unread-message-count"],
    queryFn: () => api.get("/chat/messages/unread-count"),
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
  });
};
