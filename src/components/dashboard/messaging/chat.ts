export interface Participant {
  codec: string;
  firstname: string;
  lastname: string;
  username: string;
  display_picture_url: string;
  role?: string;
  is_verified?: boolean;
}

export interface ConversationProperty {
  id: string;
  slug: string;
  title: string;
  category_slug: string | null;
}

export interface Attachment {
  filename: string;
  path: string;
  url: string;
  mime: string;
  size: number;
}

export interface LastMessage {
  id: number;
  sender_codec: string;
  sender: Participant;
  body: string;
  attachments: Attachment[];
  reply_to: null | any; // You might want to define a proper type for replies
  read_at: string | null;
  created_at: string;
}

export interface Conversation {
  id: number;
  subject: string;
  type: "private" | "group";
  participants_count: number;
  participants: Participant[];
  last_message: LastMessage | null;
  unread_count: number;
  updated_at: string;
  property?: ConversationProperty | null;
}

export interface PaginatedConversations {
  data: Conversation[];
  links: { [key: string]: string | null };
  meta: { [key: string]: any };
}
