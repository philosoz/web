export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  tags?: string[];
  relatedPosts?: Post[];
};

export type Post = {
  slug: string;
  title: string;
  excerpt?: string;
  tags?: string[];
  date?: string;
};

// 共享的 ChatMessage 类型（用于 API 通信）
export interface ChatMessageDTO {
  role: "user" | "assistant";
  content: string;
}

// Chat Session 类型
export interface ChatSessionDTO {
  id: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessageDTO[];
  tags: string[];
  summary?: string;
  isFavorite: boolean;
}
