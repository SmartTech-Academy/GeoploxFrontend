import React, { useState, useEffect, useRef, Fragment } from 'react';
import { MoreHorizontal, Smile, Paperclip, Flag, Trash2, X, SendHorizonal } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { format, parseISO } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useDeleteConversation,
  useGetMessages,
  useMarkConversationAsRead,
  useReportConversation,
  useSendMessage,
} from '@/lib/services/chat';
import { UserProfile } from '@/lib/types';
import LoadingFallback from '@/components/loading-fallback';
import { cn } from '@/lib/utils';
import { Conversation } from './chat';

interface ChatViewProps {
  selectedChat: Conversation;

  setSelectedChat: (chat: Conversation | null) => void;
  profileData: UserProfile | undefined;
}

export const ChatView: React.FC<ChatViewProps> = ({ selectedChat, setSelectedChat, profileData }) => {
  const { ref, inView } = useInView();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');

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
    setMessage('');
  };

  const handleReport = () => {
    if (selectedChat) {
      reportConversation({ id: String(selectedChat.id), data: { reason: 'Spam' } });
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

  return (
    <div className="flex h-full flex-1 flex-col rounded-b-[10px] border-y border-r border-[#E8E8E8] lg:rounded-[10px]">
      <div className="rounded-t-[10px] border-b border-[#E8E8E8] bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="size-16 rounded-[6px]">
                <AvatarImage src={otherParticipant?.display_picture_url} />
                <AvatarFallback className="bg-gray-200">
                  {`${otherParticipant?.firstname[0] ?? ''}${otherParticipant?.lastname[0] ?? ''}`}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{`${otherParticipant?.firstname} ${otherParticipant?.lastname}`}</h2>
              <p className="text-sm text-gray-500">
                {otherParticipant?.username ? `@${otherParticipant.username}` : 'Online'}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full p-2 hover:bg-gray-100">
                <MoreHorizontal className="size-6 text-[#646474]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleReport} className="flex items-center space-x-3">
                <Flag className="size-4  text-gray-600" />
                <span>Report User</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="flex items-center space-x-3 text-red-600">
                <Trash2 className="size-4 " />
                <span>Delete Chat</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedChat(null)} className="flex items-center space-x-3">
                <X className="size-4  text-gray-600" />
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
              format(parseISO(msg.created_at), 'yyyy-MM-dd') !==
                format(parseISO(allMessages[index - 1].created_at), 'yyyy-MM-dd');

            return (
              <Fragment key={msg.id}>
                {showDateDivider && (
                  <div className="relative my-4 w-full">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-[#F9F9F9] px-2 text-sm text-gray-500">
                        {format(parseISO(msg.created_at), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                )}
                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-xs space-x-2 lg:max-w-md`}>
                    {!isMe && (
                      <Avatar className="size-10 rounded-[10px]">
                        <AvatarImage src={msg.sender.display_picture_url} />
                        <AvatarFallback className="bg-gray-200">
                          {`${msg.sender.firstname[0]}${msg.sender.lastname[0]}`}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-3',
                        isMe
                          ? 'rounded-br-md bg-[#D4AF36] text-white shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.04),0px_4px_6px_-2px_rgba(16,24,40,0.02)]'
                          : 'rounded-bl-md border border-[#ECECEC] bg-white text-[#2E2E3E]'
                      )}
                    >
                      <p className="text-sm">{msg.body}</p>
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
                className="h-auto rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              >
                <Smile className="size-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-auto rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              >
                <Paperclip className="size-4" />
              </Button>
            </div>
            <Button
              type="submit"
              size="sm"
              style={{
                background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
                boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
              }}
              className="h-8 rounded-[40px] border border-[oklch(0.235_0_0/50%)] bg-gray-800 p-3 text-white hover:bg-gray-700"
            >
              Send
              <SendHorizonal className="size-4 " />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
