import React, { useState, useEffect, useRef, Fragment } from "react";
import {
  MoreHorizontal,
  Smile,
  Paperclip,
  Flag,
  Trash2,
  X,
  SendHorizonal,
  BadgeCheck,
  Home,
  Check,
  CheckCheck,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import { format, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDeleteConversation,
  useGetMessages,
  useGetNewMessages,
  useMarkConversationAsRead,
  useReportConversation,
  useSendMessage,
} from "@/lib/services/chat";
import { queryClient } from "@/lib/queryClient";
import { UserProfile } from "@/lib/types";
import LoadingFallback from "@/components/loading-fallback";
import { cn } from "@/lib/utils";
import { Conversation, LastMessage } from "./chat";

interface MessagesInfiniteData {
  pages: { data: LastMessage[]; [key: string]: any }[];
  pageParams: unknown[];
}

// Same friendly labels used for the role selector at sign-up (form-account-type.tsx) -
// the stored role value stays "client" etc., only the displayed label changed there.
const ROLE_LABELS: Record<string, string> = {
  owner: "Property Owner",
  developer: "Developer",
  agent: "Real Estate Consultant",
  client: "Investor",
};

interface ChatViewProps {
  selectedChat: Conversation;

  setSelectedChat: (chat: Conversation | null) => void;
  profileData: UserProfile | undefined;
}

export const ChatView: React.FC<ChatViewProps> = ({
  selectedChat,
  setSelectedChat,
  profileData,
}) => {
  const { ref, inView } = useInView();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");

  const {
    data: messagesData,
    fetchNextPage: fetchNextMessages,
    hasNextPage: hasNextMessages,
    isFetchingNextPage: isFetchingNextMessages,
    isLoading: isLoadingMessages,
  } = useGetMessages(selectedChat?.id ?? null, { per_page: 30 });

  const { mutate: sendMessage } = useSendMessage(String(selectedChat?.id));
  const { mutate: markAsRead } = useMarkConversationAsRead();
  const { mutate: deleteConversation } = useDeleteConversation();
  const { mutate: reportConversation } = useReportConversation();

  useEffect(() => {
    if (inView && hasNextMessages && !isFetchingNextMessages) {
      fetchNextMessages();
    }
  }, [inView, hasNextMessages, isFetchingNextMessages, fetchNextMessages]);

  useEffect(() => {
    if (selectedChat && selectedChat.unread_count > 0) {
      markAsRead(String(selectedChat.id));
    }
  }, [selectedChat, markAsRead]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;
    sendMessage({ body: message });
    setMessage("");
  };

  const handleReport = () => {
    if (selectedChat) {
      reportConversation({ id: String(selectedChat.id), data: { reason: "Spam" } });
    }
  };

  const handleDelete = () => {
    if (selectedChat) {
      deleteConversation(String(selectedChat.id));
      setSelectedChat(null);
    }
  };

  const otherParticipant = selectedChat.participants.find((p) => p.codec !== profileData?.codec);
  const allMessages = messagesData?.pages.flatMap((page) => page.data).reverse() ?? [];

  // Cursor for the lightweight real-time poll below: the newest message id currently in view.
  // Never starts from 0 once history exists, and isn't its own separate state - it's derived
  // fresh from the same cache the poll writes back into, so it can't drift out of sync with what
  // the user is actually looking at.
  const latestMessageId = allMessages.length > 0 ? allMessages[allMessages.length - 1].id : 0;

  const { data: pollData } = useGetNewMessages(
    selectedChat.id,
    latestMessageId,
    !isLoadingMessages,
  );

  // Merge newly-polled messages into the same query cache useGetMessages reads from, instead of
  // maintaining a second parallel copy of the message list.
  useEffect(() => {
    if (!pollData || pollData.messages.length === 0) return;

    const queryKey = ["messages", selectedChat.id, { per_page: 30 }];
    queryClient.setQueryData(queryKey, (old: MessagesInfiniteData | undefined) => {
      if (!old) return old;
      const firstPage = old.pages[0];
      if (!firstPage) return old;

      // poll returns oldest-of-the-new-batch first; firstPage.data is newest-first, so reverse
      // before prepending - and drop anything already present (e.g. a message the user just sent
      // themselves, which the send mutation's own refetch already placed in the cache).
      const existingIds = new Set(firstPage.data.map((m) => m.id));
      const toPrepend = [...pollData.messages].reverse().filter((m) => !existingIds.has(m.id));
      if (toPrepend.length === 0) return old;

      const pages = [...old.pages];
      pages[0] = { ...firstPage, data: [...toPrepend, ...firstPage.data] };
      return { ...old, pages };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollData, selectedChat.id]);

  // Auto-scroll to the newest message - but only when the newest message actually changes (a
  // message arrived or was sent), never when older history loads in from scrolling up, which
  // would otherwise yank the user back down mid-read.
  const latestSeenIdRef = useRef<number | null>(null);
  useEffect(() => {
    if (latestMessageId && latestMessageId !== latestSeenIdRef.current) {
      latestSeenIdRef.current = latestMessageId;
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [latestMessageId]);

  return (
    <div className="flex h-full flex-1 flex-col rounded-b-[10px] border-y border-r border-[#E8E8E8] lg:rounded-[10px]">
      <div className="rounded-t-[10px] border-b border-[#E8E8E8] bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="size-16 rounded-[6px]">
                <AvatarImage src={otherParticipant?.display_picture_url} />
                <AvatarFallback className="bg-gray-200">
                  {`${otherParticipant?.firstname?.[0] ?? ""}${otherParticipant?.lastname?.[0] ?? ""}`}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className="flex items-center gap-1.5 font-semibold text-gray-900">
                {otherParticipant
                  ? `${otherParticipant.firstname} ${otherParticipant.lastname}`
                  : "Unknown User"}
                {otherParticipant?.is_verified && (
                  <BadgeCheck
                    className="size-4 shrink-0 text-[#0AA6A9]"
                    aria-label="Verified account"
                  />
                )}
              </h2>
              <p className="text-sm text-gray-500">
                {otherParticipant?.role
                  ? ROLE_LABELS[otherParticipant.role] || otherParticipant.role
                  : otherParticipant?.username
                    ? `@${otherParticipant.username}`
                    : "Online"}
              </p>
              {selectedChat.property && selectedChat.property.category_slug && (
                <a
                  href={`/${selectedChat.property.category_slug}/${selectedChat.property.slug}`}
                  className="mt-1 flex items-center gap-1 text-xs text-[#D4AF36] hover:underline"
                >
                  <Home className="size-3" />
                  <span className="max-w-[220px] truncate">{selectedChat.property.title}</span>
                </a>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Chat options"
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <MoreHorizontal className="size-6 text-[#646474]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleReport} className="flex items-center space-x-3">
                <Flag className="size-4 text-gray-600" />
                <span>Report User</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="flex items-center space-x-3 text-red-600"
              >
                <Trash2 className="size-4" />
                <span>Delete Chat</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedChat(null)}
                className="flex items-center space-x-3"
              >
                <X className="size-4 text-gray-600" />
                <span>Close Chat</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-[#F9F9F9] px-8 py-4">
        <div ref={ref} />
        {isLoadingMessages ? (
          <LoadingFallback />
        ) : (
          allMessages.map((msg, index) => {
            const isMe = msg.sender.codec === profileData?.codec;
            const showDateDivider =
              index === 0 ||
              format(parseISO(msg.created_at), "yyyy-MM-dd") !==
                format(parseISO(allMessages[index - 1].created_at), "yyyy-MM-dd");

            return (
              <Fragment key={msg.id}>
                {showDateDivider && (
                  <div className="relative my-4 w-full">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-[#F9F9F9] px-2 text-sm text-gray-500">
                        {format(parseISO(msg.created_at), "MMMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                )}
                <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`flex max-w-xs space-x-2 lg:max-w-md`}>
                    {!isMe && (
                      <Avatar className="size-10 rounded-[10px]">
                        <AvatarImage src={msg.sender.display_picture_url} />
                        <AvatarFallback className="bg-gray-200">
                          {`${msg.sender.firstname?.[0] ?? ""}${msg.sender.lastname?.[0] ?? ""}`}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "flex flex-col gap-1 rounded-2xl px-4 py-3",
                        isMe
                          ? "rounded-br-md bg-[#D4AF36] text-white shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.04),0px_4px_6px_-2px_rgba(16,24,40,0.02)]"
                          : "rounded-bl-md border border-[#ECECEC] bg-white text-[#2E2E3E]",
                      )}
                    >
                      <p className="text-sm">{msg.body}</p>
                      <div
                        className={cn(
                          "flex items-center justify-end gap-1 text-[10px]",
                          isMe ? "text-white/70" : "text-gray-400",
                        )}
                      >
                        <span>{format(parseISO(msg.created_at), "h:mm a")}</span>
                        {isMe &&
                          (msg.read_at ? (
                            <CheckCheck className="size-3" aria-label="Read" />
                          ) : (
                            <Check className="size-3" aria-label="Sent" />
                          ))}
                      </div>
                    </div>
                    {isMe && (
                      <Avatar className="size-10 rounded-[10px]">
                        <AvatarImage src={profileData?.display_picture_url} />
                        <AvatarFallback className="bg-gray-200">Me</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              </Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full rounded-b-[10px] border-t border-[#E8E8E8] bg-white p-4 lg:p-5">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center rounded-[5px] border border-gray-300 bg-[#F9F9F9] px-4 py-3 ring-ring has-focus-within:border-ring has-focus-visible:ring-2"
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 rounded-[5px] border-none bg-transparent text-sm placeholder-gray-400 shadow-none focus:outline-none focus-visible:ring-0"
            type="text"
          />
          <div className="ml-2 flex items-center space-x-1 md:ml-3 md:space-x-2">
            <div className="flex items-center gap-2 border-r border-[#DDDDDD] px-4 py-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled
                aria-label="Emoji picker (coming soon)"
                title="Coming soon"
                className="h-auto rounded-full p-1 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Smile className="size-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled
                aria-label="Attach file (coming soon)"
                title="Coming soon"
                className="h-auto rounded-full p-1 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Paperclip className="size-4" />
              </Button>
            </div>
            <Button
              type="submit"
              size="sm"
              style={{
                background: "linear-gradient(180deg, #505050 0%, #1E1E1E 60%)",
                boxShadow:
                  "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
              }}
              className="h-8 rounded-[40px] border border-[oklch(0.235_0_0/50%)] bg-gray-800 p-3 text-white hover:bg-gray-700"
            >
              Send
              <SendHorizonal className="size-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
