import { useEffect, useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { PageMetaTags } from "@/components/page-meta-data";
import { useGetConversations } from "@/lib/services/chat";
import { useGetProfileData } from "@/lib/services/profile";
import assets from "@/assets";
import { Conversation } from "./chat";
import { ChatList } from "./chat-list";
import { ChatView } from "./chat-view";

const MessagingPage = () => {
  const { conversationId } = useSearch({ from: "/_dashboard/messages/" });
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: profileData } = useGetProfileData();

  const {
    data: conversationsData,
    fetchNextPage: fetchNextConversations,
    hasNextPage: hasNextConversations,
    isFetchingNextPage: isFetchingNextConversations,
    isLoading: isLoadingConversations,
  } = useGetConversations({
    per_page: 15,
    q: searchQuery,
    ...(filter === "unread" && { unread: 1 }),
  });

  const handleSelectChat = (chat: Conversation) => {
    setSelectedChat(chat);
  };

  const EmptyState = ({ type }: { type: "chat" | "list" }) => {
    if (type === "chat") {
      return (
        <div className="flex size-full flex-col items-center justify-center gap-4 bg-[#F9F9F9]">
          <div className="flex flex-col items-center justify-center gap-6">
            <img
              src={assets.messagingloading}
              alt="loading"
              className="h-[84px] w-[224px] animate-pulse"
              width={224}
              height={84}
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <h5 className="text-[20px]/7 font-normal text-[#1F2130]">No message yet</h5>

              <p className="text-center text-[14px]/5 tracking-[-0.02em] text-[#71748C]">
                Once you start a new conversation,
                <br /> you’ll see it here.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return (
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
  };

  const allConversations = (conversationsData?.pages.flatMap((page) => page.data) ?? []).filter(
    (conversation: Conversation) =>
      conversation.participants.some((p) => p.codec !== profileData?.codec),
  );

  // Deep-link support: arriving at /messages?conversationId=X (from the notification
  // popover, or from messaging a property owner) auto-opens that specific conversation
  // once it shows up in the loaded list, instead of leaving the user on the plain inbox.
  useEffect(() => {
    if (!conversationId || selectedChat) return;
    const match = allConversations.find((c) => String(c.id) === conversationId);
    if (match) setSelectedChat(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, allConversations]);

  return (
    <div className="flex h-screen w-full flex-col items-start gap-0 self-stretch py-8 lg:flex-row">
      <PageMetaTags
        title="Messages"
        description="View and respond to messages from potential buyers, sellers, and tenants."
        keywords="property messages, buyer inquiries, tenant communication"
      />

      {/* Mobile View */}
      <div className="h-[calc(100svh-150px)] w-full overflow-y-auto lg:hidden">
        {!selectedChat ? (
          <div className="w-full">
            <ChatList
              conversations={allConversations}
              selectedChat={selectedChat}
              onSelectChat={handleSelectChat}
              isLoading={isLoadingConversations}
              hasNextPage={hasNextConversations}
              isFetchingNextPage={isFetchingNextConversations}
              fetchNextPage={fetchNextConversations}
              profileData={profileData}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filter={filter}
              setFilter={setFilter}
            />
          </div>
        ) : (
          <>
            <Button variant="link" onClick={() => setSelectedChat(null)} className="mb-4 px-4">
              &larr; Back to list
            </Button>
            <ChatView
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              profileData={profileData}
            />
          </>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden size-full lg:flex">
        <ResizablePanelGroup orientation="horizontal" className="size-full">
          <ResizablePanel
            defaultSize="35%"
            minSize="25%"
            maxSize="50%"
            className="border-r border-[#F1F1F4]"
          >
            <div className="h-full">
              <ChatList
                conversations={allConversations}
                selectedChat={selectedChat}
                onSelectChat={handleSelectChat}
                isLoading={isLoadingConversations}
                hasNextPage={hasNextConversations}
                isFetchingNextPage={isFetchingNextConversations}
                fetchNextPage={fetchNextConversations}
                profileData={profileData}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filter={filter}
                setFilter={setFilter}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle className="w-px hover:bg-gray-200" />
          <ResizablePanel defaultSize="65%" minSize="50%">
            <div className="h-[calc(100svh-150px)] w-full">
              {selectedChat ? (
                <ChatView
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  profileData={profileData}
                />
              ) : (
                <EmptyState type="chat" />
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default MessagingPage;
