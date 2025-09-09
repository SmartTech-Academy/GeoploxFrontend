import { useState } from 'react';
import { Search, MoreHorizontal, Smile, Paperclip, Flag, Trash2, CheckCheck, X, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import assets from '@/assets';
import { PageMetaTags } from '@/components/page-meta-data';

interface Conversation {
  id: number;
  name: string;
  message: string;
  time: string;
  unread: number;
  avatar: string;
}

interface ChatMessage {
  id: number;
  sender: 'me' | 'other';
  message: string;
  time: string;
  status?: 'delivered' | 'read';
}

const MessagingPage = () => {
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [message, setMessage] = useState('');

  const conversations: Conversation[] = [
    {
      id: 1,
      name: 'Daniel Hamilton',
      message: "It's okay. Thanks",
      time: '18:34',
      unread: 7,
      avatar: assets.messaging1,
    },
    {
      id: 2,
      name: 'David Elson',
      message: "It's okay. Thanks",
      time: '18:34',
      unread: 0,
      avatar: assets.messaging2,
    },
    {
      id: 3,
      name: 'Stephanie Nicol',
      message: "It's okay. Thanks",
      time: '18:34',
      unread: 7,
      avatar: assets.messaging3,
    },
    {
      id: 4,
      name: 'Rodger Struck',
      message: "It's okay. Thanks",
      time: '18:34',
      unread: 0,
      avatar: assets.messaging4,
    },
    {
      id: 6,
      name: 'Kathy Pacheco',
      message: "It's okay. Thanks",
      time: '18:34',
      unread: 0,
      avatar: assets.herohouse,
    },
  ];

  const chatMessages: ChatMessage[] | null = selectedChat
    ? [
        {
          id: 1,
          sender: 'other',
          message:
            "Sounds perfect! Let's schedule a session for later this week. I'll send you a message to finalize the date and time. Looking forward to an amazing service!",
          time: 'Yesterday, 09:10pm',
        },
        {
          id: 2,
          sender: 'other',
          message: 'Let me know what you think',
          time: 'Yesterday, 09:10pm',
        },
        {
          id: 3,
          sender: 'me',
          message:
            "Absolutely! I've got availability tomorrow at 10 AM, 12 PM, or 4 PM. Does any of those times work for you!",
          time: 'Today, 09:10pm',
          status: 'delivered',
        },
        {
          id: 4,
          sender: 'me',
          message: 'Please do not keep me waiting.',
          time: 'Today, 09:10pm',
          status: 'delivered',
        },
      ]
    : null;

  const EmptyState = ({ type }: { type: 'chat' | 'list' }) => {
    if (type === 'chat') {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#F9F9F9]">
          <div className="flex flex-col items-center justify-center gap-6">
            <img
              src={assets.messagingloading}
              alt="loading"
              className="h-[84px] w-[224px] animate-pulse"
              width={224}
              height={84}
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <h5 className="text-[20px] leading-[28px] font-normal text-[#1F2130]">No message yet</h5>

              <p className="text-center text-[14px] leading-[20px] tracking-[-0.02em] text-[#71748C]">
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
        <img src={assets.chatloading} className="h-[112px] w-[211px] animate-pulse" width={211} height={112} />
        <div className="flex flex-col items-center justify-center gap-3">
          <h5 className="text-[20px] leading-[28px] font-semibold text-[#1F2130]">Your chat is empty</h5>
          <p className="text-[14px] leading-[17px] tracking-[-0.02em] text-[#71748C]">
            It looks like you haven’t had a chat yet.
          </p>
        </div>
      </div>
    );
  };

  const filteredConversations = filter === 'unread' ? conversations.filter((chat) => chat.unread > 0) : conversations;

  const ChatList = ({ onSelectChat }: { onSelectChat: any }) => (
    <div className="flex h-full flex-col gap-4 bg-white lg:pr-6">
      {/* Search Bar */}
      <div className="flex w-full flex-col gap-6 border-b border-[#E8E8E8] pr-6 pb-4 lg:pr-0">
        <div className="relative pt-0.5">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-[#D4AF36]" />
          <Input
            type="text"
            placeholder="Search messages"
            className="h-10 self-stretch rounded-[8px] border border-[#D5D5DD] px-3 pl-10"
          />
        </div>

        {/* Filter Tabs */}
        <div className="w-full">
          <div className="flex items-center gap-1.5">
            <Button
              variant={filter === 'all' ? 'outline' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className={`h-[36px] min-w-[55px] rounded-full font-semibold ${
                filter === 'all'
                  ? 'text-primary border-[#EAEAEA] hover:bg-yellow-50'
                  : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
              }`}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'outline' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
              className={`h-[36px] min-w-[55px] rounded-full font-semibold ${
                filter === 'unread'
                  ? 'text-primary border-[#EAEAEA] hover:bg-yellow-50'
                  : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
              }`}
            >
              Unread
            </Button>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto pr-6 lg:pr-0">
        {filteredConversations.length === 0 ? (
          <EmptyState type="list" />
        ) : (
          filteredConversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`cursor-pointer border-b border-[#E3E3E8] p-4 transition-colors hover:bg-gray-50 ${
                selectedChat?.id === chat.id ? 'bg-[#FDF9ED]' : ''
              }`}
            >
              <div className="flex w-full items-center gap-[14px]">
                <div className="relative">
                  <Avatar className="size-[64px] rounded-[6px]">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback className="bg-gray-200">
                      {chat.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="truncate text-[14px] leading-[17px] font-semibold text-[#41415A]">{chat.name}</h3>

                    <div className="flex items-center space-x-2">
                      <span className="text-[12px] leading-[14px] text-[#71748C]">{chat.time}</span>
                      {chat.unread > 0 && (
                        <Badge className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-0 hover:bg-red-500">
                          <span className="text-xs font-medium text-white">{chat.unread}</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 truncate text-[12px] leading-[14px] tracking-[0.01em] text-[#71748C]">
                    {chat.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const ChatView = () => {
    if (!selectedChat) {
      return <EmptyState type="chat" />;
    }

    return (
      <div className="flex h-full flex-1 flex-col rounded-b-[10px] border-y border-r border-[#E8E8E8] lg:rounded-[10px]">
        {/* Chat Header */}
        <div className="rounded-t-[10px] border-b border-[#E8E8E8] bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="size-[64px] rounded-[6px]">
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback className="bg-gray-200">
                    {selectedChat.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{selectedChat.name}</h2>
                <p className="text-sm text-gray-500">
                  {selectedChat.name === 'David Elson' ? 'ruthbabel@gmail.com | 08056789473' : 'Online'}
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
                <DropdownMenuItem className="flex items-center space-x-3">
                  <Flag className="h-4 w-4 text-gray-600" />
                  <span>Report User</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-3 text-red-600">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Chat</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedChat(null)} className="flex items-center space-x-3">
                  <X className="h-4 w-4 text-gray-600" />
                  <span>Close Chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-[#F9F9F9] px-8 py-4">
          {chatMessages?.map((msg) => (
            <div key={msg.id}>
              {msg.id === 1 && (
                <div className="relative mb-4 w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-[#F9F9F9] px-2 text-sm text-gray-500">Yesterday</span>
                  </div>
                </div>
              )}
              {msg.id === 3 && (
                <div className="relative mb-4 w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-[#F9F9F9] px-2 text-sm text-gray-500">Today</span>
                  </div>
                </div>
              )}

              <div className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-xs space-x-2 lg:max-w-md`}>
                  {msg.sender === 'other' && (
                    <Avatar className="size-10 rounded-[10px]">
                      <AvatarImage src={selectedChat.avatar} />
                      <AvatarFallback className="bg-gray-200">
                        {selectedChat.name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.sender === 'me'
                        ? 'rounded-br-md bg-[#D4AF36] text-white shadow-[0px_12px_16px_-4px_rgba(16,_24,_40,_0.04),_0px_4px_6px_-2px_rgba(16,_24,_40,_0.02)]'
                        : 'rounded-bl-md border border-[#ECECEC] bg-white text-[#2E2E3E]'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  {msg.sender === 'me' && (
                    <Avatar className="size-10 rounded-[10px]">
                      <AvatarImage src={assets.landlord} />
                      <AvatarFallback className="bg-gray-200">Me</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>

              <div
                className={`mt-1 flex items-center space-x-2 text-xs text-gray-500 ${
                  msg.sender === 'me' ? 'justify-end' : 'justify-start'
                }`}
              >
                <span>{msg.time}</span>
                {msg.sender === 'me' && msg.status && <CheckCheck className="h-3 w-3 text-gray-400" />}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="w-full rounded-b-[10px] border-t border-[#E8E8E8] bg-white p-4 lg:p-5">
          <div className="ring-ring has-focus-within:border-ring flex items-center rounded-[5px] border border-gray-300 bg-[#F9F9F9] px-4 py-3 has-focus-visible:ring-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-1 rounded-[5px] border-none bg-transparent text-sm placeholder-gray-400 shadow-none focus:outline-none focus-visible:ring-0"
              type="text"
            />

            {/* Icons and send button inside the input container */}
            <div className="ml-2 flex items-center space-x-1 md:ml-3 md:space-x-2">
              <div className="flex items-center gap-2 border-r border-[#DDDDDD] px-4 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                >
                  <Smile className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-auto rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                >
                  <Paperclip className="size-4" />
                </Button>
              </div>

              <Button
                size="sm"
                style={{
                  background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
                  boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                }}
                className="h-8 rounded-[40px] border border-[oklch(0.235_0_0_/_50%)] bg-gray-800 p-3 text-white hover:bg-gray-700"
              >
                Send
                <SendHorizonal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full flex-col items-start gap-0 self-stretch py-8 lg:flex-row">
      <PageMetaTags
        title="Messages"
        description="View and respond to messages from potential buyers, sellers, and tenants."
        keywords="property messages, buyer inquiries, tenant communication"
      />

      {/* Mobile View */}
      <div className="w-full lg:hidden">
        {!selectedChat ? (
          <div className="px-4">
            <ChatList onSelectChat={setSelectedChat} />
          </div>
        ) : (
          <>
            <Button variant="link" onClick={() => setSelectedChat(null)} className="mb-4 px-4">
              &larr; Back to list
            </Button>
            <ChatView />
          </>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden h-full w-full lg:flex">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={35} minSize={25} maxSize={50} className="border-r border-[#F1F1F4]">
            <div className="h-full">
              <ChatList onSelectChat={setSelectedChat} />
            </div>
          </ResizablePanel>
          <ResizableHandle className="w-px hover:bg-gray-200" />
          <ResizablePanel defaultSize={65} minSize={50}>
            <div className="h-[calc(100svh-150px)] w-full">
              {selectedChat ? <ChatView /> : <EmptyState type="chat" />}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default MessagingPage;
