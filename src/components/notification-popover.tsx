import { Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useDeleteNotification,
} from "@/lib/services/notifications";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Link, useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Notification } from "@/lib/notifications";

export function NotificationPopover() {
  const navigate = useNavigate();
  const { data: notificationsResponse, isLoading } = useGetNotifications();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const notifications = notificationsResponse?.pages.flatMap((page) => page.data.data) ?? [];
  const unreadCount = notificationsResponse?.pages[0]?.data.unread_count ?? 0;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
    if (notification.type.includes("NewMessageNotification")) {
      navigate({ to: "/messages", search: { conversationId: notification.data.conversation_id } });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-8 rounded-full border-[0.5px] border-[#D5D5DD]"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute top-0 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button variant="link" className="h-auto p-0 text-xs" onClick={() => markAllAsRead()}>
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
          ) : notifications.length === 0 ? (
            <DropdownMenuItem disabled>No notifications yet.</DropdownMenuItem>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-2",
                  !notification.read_at && "bg-yellow-50/50",
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <Avatar className="size-8">
                  <AvatarImage
                    src={notification.sender?.display_picture}
                    alt={notification.sender?.username}
                  />
                  <AvatarFallback>{notification.sender?.firstname[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-semibold">
                      {notification.sender
                        ? `${notification.sender.firstname} ${notification.sender.lastname}`
                        : "System"}
                    </span>{" "}
                    {notification.type.includes("NewMessageNotification")
                      ? "sent you a message."
                      : notification.data.title}
                  </p>
                  <p className="text-xs text-gray-500">{notification.data.body}</p>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(parseISO(notification.created_at))} ago
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  {!notification.read_at && (
                    <div className="size-2 self-end rounded-full bg-blue-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center">
          <Link to="/notifications" className="text-sm font-medium text-blue-600">
            See all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
