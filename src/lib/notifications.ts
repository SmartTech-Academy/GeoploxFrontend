export interface NotificationSender {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  display_picture: string;
}

export interface NotificationData {
  message_id?: number;
  conversation_id?: number;
  body?: string;
  sender_id?: string;
  title?: string;
}

export interface Notification {
  id: string;
  type: string;
  data: NotificationData;
  sender: NotificationSender | null;
  read_at: string | null;
  created_at: string;
}

export interface NotificationsResponse {
  status: string;
  message: string;
  data: {
    data: Notification[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
    unread_count: number;
  };
}
