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
