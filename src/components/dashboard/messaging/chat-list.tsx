import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Search } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import LoadingFallback from "@/components/loading-fallback";
import { Conversation } from "./chat";
import { UserProfile } from "@/lib/types";
import assets from "@/assets";

interface ChatListProps {
  conversations: Conversation[];
  selectedChat: Conversation | null;

  onSelectChat: (chat: Conversation) => void;
  isLoading: boolean;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  profileData: UserProfile | undefined;
  searchQuery: string;

  setSearchQuery: (query: string) => void;
  filter: "all" | "unread";

  setFilter: (filter: "all" | "unread") => void;
}

const EmptyState = () => (
  <div className="flex w-full flex-col items-center justify-center gap-8 self-stretch py-14">
    <img
      src={assets.chatloading}
      className="h-[112px] w-[211px] animate-pulse"
      width={211}
      height={112}
    />
    <div className="flex flex-col items-center justify-center gap-3">
      <h5 className="text-[20px]/7 font-semibold text-[#1F2130]">Your chat is empty</h5>
      <p className="text-[14px] leading-[17px] tracking-[-0.02em] text-[#71748C]">
        It looks like you haven’t had a chat yet.
      </p>
    </div>
  </div>
);

export const ChatList: React.FC<ChatListProps> = ({
  conversations,
  selectedChat,
  onSelectChat,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  profileData,
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
}) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find((p) => p.codec !== profileData?.codec);
  };

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  };

  return (
    <div className="flex h-full flex-col gap-4 bg-white lg:pr-6">
      <div className="flex w-full flex-col gap-6 border-b border-[#E8E8E8] pr-6 pb-4 lg:pr-0">
        <div className="relative pt-0.5">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-[#D4AF36]" />
          <Input
            type="text"
            placeholder="Search messages"
            className="h-10 self-stretch rounded-xl border border-[#D5D5DD] px-3 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full">
          <div className="flex items-center gap-1.5">
            <Button
              variant={filter === "all" ? "outline" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
              className={`h-[36px] min-w-[55px] rounded-full font-semibold ${
                filter === "all"
                  ? "border-[#EAEAEA] text-primary hover:bg-yellow-50"
                  : "bg-[#ECECEC] text-[#41415C] hover:text-gray-800"
              }`}
            >
              All
            </Button>
            <Button
              variant={filter === "unread" ? "outline" : "ghost"}
              size="sm"
              onClick={() => setFilter("unread")}
              className={`h-[36px] min-w-[55px] rounded-full font-semibold ${
                filter === "unread"
                  ? "border-[#EAEAEA] text-primary hover:bg-yellow-50"
                  : "bg-[#ECECEC] text-[#41415C] hover:text-gray-800"
              }`}
            >
              Unread
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pr-6 lg:pr-0">
        {isLoading ? (
          <LoadingFallback />
        ) : conversations.length === 0 ? (
          <EmptyState />
        ) : (
          conversations.map((chat) => {
            const otherParticipant = getOtherParticipant(chat);
            if (!otherParticipant) return null;
            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={`cursor-pointer border-b border-[#E3E3E8] p-4 transition-colors hover:bg-gray-50 ${
                  selectedChat?.id === chat.id ? "bg-[#FDF9ED]" : ""
                }`}
              >
                <div className="flex w-full items-center gap-3.5">
                  <div className="relative">
                    <Avatar className="size-16 rounded-[6px]">
                      <AvatarImage src={otherParticipant.display_picture_url} />
                      <AvatarFallback className="bg-gray-200">
                        {`${otherParticipant.firstname[0]}${otherParticipant.lastname[0]}`}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="truncate text-[14px] leading-[17px] font-semibold text-[#41415A]">
                        {`${otherParticipant.firstname} ${otherParticipant.lastname}`}
                      </h3>
                      <div className="flex max-w-10 flex-col items-end lg:flex-row lg:space-x-2">
                        <span className="line-clamp-1 text-[12px]/3.5 text-[#71748C]">
                          {chat.last_message ? formatTime(chat.last_message.created_at) : ""}
                        </span>
                        {chat.unread_count > 0 && (
                          <Badge className="flex size-5 items-center justify-center rounded-full bg-red-500 p-0 hover:bg-red-500">
                            <span className="text-xs font-medium text-white">
                              {chat.unread_count}
                            </span>
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 truncate text-[12px]/3.5 tracking-[0.01em] text-[#71748C]">
                      {chat.last_message?.body ?? "No messages yet"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {isFetchingNextPage && (
          <div className="flex justify-center p-4">
            <p>Loading more...</p>
          </div>
        )}
        <div ref={ref} />
      </div>
    </div>
  );
};
