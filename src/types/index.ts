export interface ToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

export interface MemberData {
  id?: string;
  username: string;
  displayName: string;
  joinedAt?: string;
  isBot: boolean;
  roles?: Array<{
    name: string;
    color: string;
  }>;
}

export interface ChannelData {
  id: string;
  name: string;
  type: string;
  position: number;
  parentId: string | null;
  parentName?: string;
}

export interface ThreadData {
  id: string;
  name: string;
  archived: boolean | null;
  locked: boolean | null;
  autoArchiveDuration: number | null;
  createdAt?: string;
  memberCount?: number;
  messageCount?: number;
}

export interface MessageData {
  id?: string;
  channel?: string;
  server?: string;
  author: string;
  authorId?: string;
  content: string;
  timestamp: string;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  embeds?: Array<{
    title?: string;
    description?: string;
    url?: string;
  }>;
}