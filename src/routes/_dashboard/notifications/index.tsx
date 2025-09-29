import NotificationsPage from '@/components/dashboard/notifications/notifications-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/notifications/')({
  component: NotificationsPage,
});
