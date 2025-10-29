import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  useGetNotifications,
  useMarkAllNotificationsAsRead,
  useBulkDeleteNotifications,
  useMarkNotificationAsRead,
  useDeleteNotification,
} from '@/lib/services/notifications';

import { formatDistanceToNow, parseISO } from 'date-fns';
import { useNavigate } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2 } from 'lucide-react';
import LoadingFallback from '@/components/loading-fallback';
import { PageMetaTags } from '@/components/page-meta-data';
import { Notification } from '@/lib/notifications';

const NotificationItem = ({
  notification,
  isSelected,
  onSelect,
}: {
  notification: Notification;
  isSelected: boolean;

  onSelect: (id: string, checked: boolean) => void;
}) => {
  const navigate = useNavigate();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const handleNotificationClick = () => {
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
    if (notification.type.includes('NewMessageNotification')) {
      navigate({ to: '/messages', search: { conversationId: notification.data.conversation_id } });
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-4 border-b p-4 transition-colors',
        !notification.read_at ? 'bg-yellow-50/50' : 'hover:bg-gray-50'
      )}
    >
      <Checkbox checked={isSelected} onCheckedChange={(checked) => onSelect(notification.id, !!checked)} />
      <div className="flex-1 cursor-pointer" onClick={handleNotificationClick}>
        <div className="flex items-start gap-3">
          <Avatar className="size-10">
            <AvatarImage src={notification.sender?.display_picture} alt={notification.sender?.username} />
            <AvatarFallback>{notification.sender?.firstname[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm">
              <span className="font-semibold">
                {notification.sender ? `${notification.sender.firstname} ${notification.sender.lastname}` : 'System'}
              </span>{' '}
              {notification.type.includes('NewMessageNotification') ? 'sent you a message.' : notification.data.title}
            </p>
            <p className="text-xs text-gray-600">{notification.data.body}</p>
            <p className="text-xs text-gray-400">{formatDistanceToNow(parseISO(notification.created_at))} ago</p>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          deleteNotification(notification.id);
        }}
      >
        <Trash2 className="size-4 text-red-500" />
      </Button>
    </div>
  );
};

export default function NotificationsPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useGetNotifications({ per_page: 20 });
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  const { mutate: bulkDelete } = useBulkDeleteNotifications();
  const [selected, setSelected] = useState<string[]>([]);
  const { ref, inView } = useInView();

  const allNotifications = data?.pages.flatMap((page) => page.data.data) ?? [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSelect = (id: string, checked: boolean) => {
    setSelected((prev) => (checked ? [...prev, id] : prev.filter((i) => i !== id)));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? allNotifications.map((n) => n.id) : []);
  };

  const handleDeleteSelected = () => {
    if (selected.length > 0) {
      bulkDelete(selected);
      setSelected([]);
    }
  };

  return (
    <div className="py-8">
      <PageMetaTags title="Notifications" description="View and manage all your notifications." />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelected}>
              Delete ({selected.length})
            </Button>
          )}
          <Button variant="outline" onClick={() => markAllAsRead()}>
            Mark all as read
          </Button>
        </div>
      </div>
      <div className="rounded-lg border">
        <div className="flex items-center border-b p-4">
          <Checkbox onCheckedChange={handleSelectAll} />
          <span className="ml-4 text-sm font-medium">Select All</span>
        </div>
        {isPending ? (
          <LoadingFallback />
        ) : (
          allNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              isSelected={selected.includes(notification.id)}
              onSelect={handleSelect}
            />
          ))
        )}
        <div ref={ref} className="p-4 text-center">
          {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load more' : 'No more notifications.'}
        </div>
      </div>
    </div>
  );
}
