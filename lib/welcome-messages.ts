export interface UserProfile {
  visitCount: number;
  interests: string[];
  lastVisit?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatSession {
  id: string;
  summary?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface WelcomeMessage {
  greeting: string;
  suggestions: string[];
  continuation?: {
    text: string;
    sessionId: string;
  };
}

function generateSuggestionsByInterest(interests: string[]): string[] {
  const suggestions: Record<string, string[]> = {
    '技术': [
      "聊聊最近的技术思考？",
      "前端架构有什么心得？",
      "代码可读性你怎么看？"
    ],
    '生活': [
      "最近有什么感悟吗？",
      "有什么日常观察想分享？",
      "最近在看什么书？"
    ],
    '工作': [
      "工作中有什么新挑战？",
      "团队协作有什么体会？",
      "最近在做什么项目？"
    ],
    '随意': [
      "最近在想什么？",
      "有什么新发现吗？",
      "有什么想聊的？"
    ]
  };
  
  let result: string[] = [];
  for (const interest of interests) {
    if (suggestions[interest]) {
      result = result.concat(suggestions[interest]);
    }
  }
  
  return result.length > 0 
    ? result.slice(0, 4) 
    : suggestions['随意'];
}

function getTopicSummary(session: ChatSession): string {
  if (session.summary) {
    return session.summary;
  }
  
  const firstMessage = session.messages[0];
  return firstMessage 
    ? firstMessage.content.slice(0, 20) 
    : '某个话题';
}

export function generateWelcomeMessage(
  profile: UserProfile, 
  sessions: ChatSession[]
): WelcomeMessage {
  if (profile.visitCount <= 1) {
    return {
      greeting: "你好呀，很高兴见到你。我是张海挺，有什么想聊的吗？",
      suggestions: [
        "你最近在写什么？",
        "你是怎么思考问题的？",
        "有什么值得看的内容吗？",
        "你平时喜欢做什么？"
      ]
    };
  }
  
  const recentSession = sessions[0];
  const interests = profile.interests;
  
  const welcome: WelcomeMessage = {
    greeting: `欢迎回来！${getGreetingByTime()}上次聊到${getTopicSummary(recentSession)}...`,
    suggestions: generateSuggestionsByInterest(interests)
  };
  
  if (recentSession && recentSession.messages.length > 0) {
    welcome.continuation = {
      text: `继续上次的话题：${getTopicSummary(recentSession)}`,
      sessionId: recentSession.id
    };
  }
  
  return welcome;
}

function getGreetingByTime(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "夜深了，";
  if (hour < 9) return "早上好，";
  if (hour < 12) return "上午好，";
  if (hour < 14) return "中午好，";
  if (hour < 18) return "下午好，";
  if (hour < 22) return "晚上好，";
  return "夜深了，";
}

export function getDefaultWelcomeMessage(): WelcomeMessage {
  return {
    greeting: "你好呀，很高兴见到你。我是张海挺，有什么想聊的吗？",
    suggestions: [
      "你最近在写什么？",
      "你是怎么思考问题的？",
      "有什么值得看的内容吗？",
      "你平时喜欢做什么？"
    ]
  };
}
