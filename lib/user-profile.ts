export interface UserProfile {
  visitCount: number;
  firstVisit: number;
  lastVisit: number;
  interests: string[];
  totalMessages: number;
}

const USER_PROFILE_KEY = 'user_profile';

export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return {
      visitCount: 0,
      firstVisit: Date.now(),
      lastVisit: Date.now(),
      interests: [],
      totalMessages: 0,
    };
  }

  const stored = localStorage.getItem(USER_PROFILE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return createInitialProfile();
    }
  }
  return createInitialProfile();
}

function createInitialProfile(): UserProfile {
  const profile: UserProfile = {
    visitCount: 1,
    firstVisit: Date.now(),
    lastVisit: Date.now(),
    interests: [],
    totalMessages: 0,
  };
  saveUserProfile(profile);
  return profile;
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

export function updateVisitCount(profile: UserProfile): UserProfile {
  const now = Date.now();
  return {
    ...profile,
    visitCount: profile.visitCount + 1,
    lastVisit: now,
  };
}

export function updateInterestFromMessage(profile: UserProfile, message: string): UserProfile {
  const interestKeywords: Record<string, string[]> = {
    '技术': ['代码', '技术', '编程', '系统', '开发', '程序', '软件', '算法', '数据库', '前端', '后端'],
    '生活': ['生活', '日常', '休息', '放松', '娱乐', '爱好', '兴趣', '运动', '旅游', '美食'],
    '工作': ['工作', '项目', '团队', '同事', '公司', '职场', '职业', '任务', '客户', '汇报'],
    '学习': ['学习', '读书', '课程', '培训', '研究', '论文', '考试', '作业', '练习'],
    '情绪': ['感觉', '心情', '情绪', '最近', '压力', '焦虑', '开心', '难过', '烦恼', '困惑'],
  };

  const detectedInterests = new Set<string>();

  for (const [interest, keywords] of Object.entries(interestKeywords)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      detectedInterests.add(interest);
    }
  }

  if (detectedInterests.size > 0) {
    const currentInterests = new Set(profile.interests);
    detectedInterests.forEach(interest => currentInterests.add(interest));

    return {
      ...profile,
      interests: Array.from(currentInterests),
      totalMessages: profile.totalMessages + 1,
    };
  }

  return {
    ...profile,
    totalMessages: profile.totalMessages + 1,
  };
}

export function initUserProfile(): UserProfile {
  const profile = getUserProfile();
  const updatedProfile = updateVisitCount(profile);
  saveUserProfile(updatedProfile);
  return updatedProfile;
}
