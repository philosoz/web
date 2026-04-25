export interface Post {
  id: string;
  title: string;
  content: string;
  category: "笔记" | "技术";
}

export const posts: Post[] = [
  {
    id: "1",
    title: "为什么我开始喜欢独处",
    content: "独处不是逃避，而是重新整理自己。在安静的时间里，我更容易听到内心的声音。独处让我学会与自己对话，也让我更懂得如何与世界相处。",
    category: "笔记",
  },
  {
    id: "2",
    title: "关于写作这件事",
    content: "写作是思考的工具，也是与自己对话的方式。每一次落笔，都是在梳理自己的思绪。我写的不是答案，是在寻找答案的路上留下的痕迹。",
    category: "笔记",
  },
  {
    id: "3",
    title: "技术成长不是工具积累",
    content: "技术成长不是工具积累，而是思维方式改变。理解问题的本质比学会用某个框架更重要。真正的高手，是能够快速理解问题本质的人。",
    category: "技术",
  },
  {
    id: "4",
    title: "我如何理解系统设计",
    content: "系统设计的核心是理解问题的本质，而不是追求复杂的架构。好的设计是大道至简，能用一个方案解决的问题，不要用两个。",
    category: "技术",
  },
];

export function findRelevantPosts(query: string): Post[] {
  const queryWords = query.toLowerCase().split(/\s+/);
  
  const scored = posts.map(post => {
    const contentWords = (post.title + " " + post.content).toLowerCase();
    let score = 0;
    
    for (const word of queryWords) {
      if (contentWords.includes(word)) {
        score += 1;
      }
    }
    
    return { post, score };
  });
  
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(s => s.post);
}

export function buildRAGContext(query: string): string {
  const relevantPosts = findRelevantPosts(query);
  
  if (relevantPosts.length === 0) {
    return "";
  }
  
  return relevantPosts
    .map(post => `【${post.title}】\n${post.content}`)
    .join("\n\n");
}
