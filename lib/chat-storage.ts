export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatSession {
  id: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  tags: string[];
  summary?: string;
  isFavorite: boolean;
}

export interface UserProfile {
  visitCount: number;
  interests: string[];
  lastVisit?: string;
  firstVisit?: string;
}

export interface WelcomeMessage {
  greeting: string;
  suggestions: string[];
  continuation?: {
    text: string;
    sessionId: string;
  };
}

const STORAGE_KEYS = {
  SESSIONS: 'chat_sessions',
  CURRENT_SESSION: 'current_session',
  USER_PROFILE: 'chat_user_profile',
} as const;

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function loadSessions(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!data) return [];
    
    const sessions = JSON.parse(data);
    if (!Array.isArray(sessions)) return [];
    
    return sessions.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    console.error('Failed to load sessions from localStorage');
    return [];
  }
}

function saveSessions(sessions: ChatSession[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch {
    console.error('Failed to save sessions to localStorage');
  }
}

export function saveSession(session: ChatSession): void {
  const sessions = loadSessions();
  const existingIndex = sessions.findIndex(s => s.id === session.id);
  
  if (existingIndex >= 0) {
    sessions[existingIndex] = { ...session, updatedAt: Date.now() };
  } else {
    sessions.push({ ...session, updatedAt: Date.now() });
  }
  
  saveSessions(sessions);
}

export function loadAllSessions(): ChatSession[] {
  return loadSessions();
}

export function getCurrentSession(): ChatSession | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const sessionId = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    if (!sessionId) return null;
    
    const sessions = loadSessions();
    return sessions.find(s => s.id === sessionId) || null;
  } catch {
    return null;
  }
}

export function setCurrentSession(sessionId: string | null): void {
  if (typeof window === 'undefined') return;
  
  try {
    if (sessionId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, sessionId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    }
  } catch {
    console.error('Failed to set current session');
  }
}

export function deleteSession(sessionId: string): void {
  const sessions = loadSessions();
  const filteredSessions = sessions.filter(s => s.id !== sessionId);
  saveSessions(filteredSessions);
  
  const currentSessionId = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
  if (currentSessionId === sessionId) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }
}

export function createSession(): ChatSession {
  const now = Date.now();
  const newSession: ChatSession = {
    id: generateSessionId(),
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        role: "assistant",
        content: "你好！我是AI助手，有什么可以帮助你的吗？"
      }
    ],
    tags: [],
    isFavorite: false,
  };
  
  saveSession(newSession);
  setCurrentSession(newSession.id);
  
  return newSession;
}

export function updateSession(
  sessionId: string,
  updates: Partial<ChatSession>
): void {
  const sessions = loadSessions();
  const index = sessions.findIndex(s => s.id === sessionId);
  
  if (index >= 0) {
    sessions[index] = {
      ...sessions[index],
      ...updates,
      updatedAt: Date.now(),
    };
    saveSessions(sessions);
  }
}

export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return { visitCount: 0, interests: [] };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (stored) {
      const profile = JSON.parse(stored) as UserProfile;
      profile.visitCount += 1;
      profile.lastVisit = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
      return profile;
    }
    
    const newProfile: UserProfile = {
      visitCount: 1,
      interests: [],
      lastVisit: new Date().toISOString(),
      firstVisit: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(newProfile));
    return newProfile;
  } catch {
    return { visitCount: 1, interests: [] };
  }
}

export function updateUserProfile(updates: Partial<UserProfile>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const current = getUserProfile();
    
    let updatedInterests = current.interests;
    if (updates.interests && updates.interests.length > 0) {
      const newInterests = updates.interests.filter(i => !current.interests.includes(i));
      updatedInterests = [...current.interests, ...newInterests];
    }
    
    const updated: UserProfile = {
      ...current,
      ...updates,
      interests: updatedInterests,
      lastVisit: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
  } catch {
    console.error('Failed to update user profile');
  }
}

export function analyzeUserInterests(sessions: ChatSession[]): string[] {
  const interests: string[] = [];
  
  const allMessages = sessions
    .flatMap(s => s.messages)
    .map(m => m.content.toLowerCase());
  
  const content = allMessages.join(' ');
  
  if (/typescript|javascript|react|vue|angular|前端|后端|api|框架|代码|编程/.test(content)) {
    interests.push('技术');
  }
  if (/工作|项目|团队|同事|任务|会议|需求|职业/.test(content)) {
    interests.push('工作');
  }
  if (/书|电影|音乐|旅行|运动|生活|日常|感悟|思考/.test(content)) {
    interests.push('生活');
  }
  
  return interests.length > 0 ? [...new Set(interests)] : ['随意'];
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
  
  const suggestions = generateSuggestionsByInterest(interests);
  
  const welcome: WelcomeMessage = {
    greeting: `欢迎回来！${getGreetingByTime()}上次聊到${getTopicSummary(recentSession)}...`,
    suggestions
  };
  
  if (recentSession && recentSession.messages.length > 0) {
    welcome.continuation = {
      text: `继续上次的话题：${getTopicSummary(recentSession)}`,
      sessionId: recentSession.id
    };
  }
  
  return welcome;
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

export { generateSessionId };
