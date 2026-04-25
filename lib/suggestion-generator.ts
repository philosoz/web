export interface Suggestion {
  text: string;
  category: 'philosophy' | 'tech' | 'psychology' | 'life';
}

const suggestions: Record<string, string[]> = {
  philosophy: [
    "想聊欲望本质？",
    "你怎么看当下的状态？",
    "最近在纠结什么？",
    "想聊存在主义？",
    "最近有什么反复出现的问题？",
  ],
  tech: [
    "想拆一个技术问题？",
    "有什么代码让你卡住了？",
    "聊聊系统设计？",
    "最近在研究什么技术？",
    "有什么架构上的困惑？",
  ],
  psychology: [
    "想复盘自己？",
    "最近的状态怎么样？",
    "有什么反复出现的念头？",
    "想聊聊情绪？",
    "最近有什么新认识？",
  ],
  life: [
    "最近有什么观察？",
    "有什么想分享的日常？",
    "最近在折腾什么？",
    "最近有什么新尝试？",
    "有什么想吐槽的？",
  ],
};

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getCategoryFromInterest(interest: string): string {
  const mapping: Record<string, string> = {
    '技术': 'tech',
    '工作': 'tech',
    '代码': 'tech',
    '编程': 'tech',
    '开发': 'tech',
    '算法': 'tech',
    '数据库': 'tech',
    '情绪': 'psychology',
    '心理': 'psychology',
    '焦虑': 'psychology',
    '抑郁': 'psychology',
    '压力': 'psychology',
    '关系': 'psychology',
    '自我': 'psychology',
    '随意': 'philosophy',
    '哲学': 'philosophy',
    '欲望': 'philosophy',
    '存在': 'philosophy',
    '生活': 'life',
    '学习': 'life',
    '休息': 'life',
    '娱乐': 'life',
    '爱好': 'life',
    '运动': 'life',
  };
  
  return mapping[interest] || 'philosophy';
}

export function generateSuggestions(
  interests: string[],
  count: number = 3
): string[] {
  if (!interests || interests.length === 0) {
    const allSuggestions = Object.values(suggestions).flat();
    return shuffleArray(allSuggestions).slice(0, count);
  }

  const selectedCategories: string[] = [];
  const categoryCount: Record<string, number> = {};

  for (const interest of interests) {
    const category = getCategoryFromInterest(interest);
    if (!categoryCount[category]) {
      categoryCount[category] = 0;
    }
    categoryCount[category]++;
  }

  const sortedCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);

  for (const category of sortedCategories) {
    if (selectedCategories.length < count) {
      selectedCategories.push(category);
    }
  }

  const allCategories = Object.keys(suggestions);
  while (selectedCategories.length < Math.min(count, allCategories.length)) {
    const remaining = allCategories.filter(c => !selectedCategories.includes(c));
    if (remaining.length > 0) {
      selectedCategories.push(remaining[Math.floor(Math.random() * remaining.length)]);
    } else {
      break;
    }
  }

  const result: string[] = [];
  
  for (const category of selectedCategories) {
    const categorySuggestions = suggestions[category] || [];
    const shuffled = shuffleArray(categorySuggestions);
    result.push(shuffled[0]);
  }

  return shuffleArray(result).slice(0, count);
}

export async function fetchAISuggestions(
  interests: string[],
  recentTopics: string[] = [],
  count: number = 3
): Promise<string[]> {
  try {
    const response = await fetch('/api/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ interests, recentTopics, count }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.suggestions || [];
  } catch (error) {
    console.error('Failed to fetch AI suggestions:', error);
    return [];
  }
}

export function getSuggestionsWithFallback(
  interests: string[],
  recentTopics: string[] = [],
  count: number = 3
): Promise<string[]> {
  return new Promise((resolve) => {
    fetchAISuggestions(interests, recentTopics, count)
      .then(aiSuggestions => {
        if (aiSuggestions.length >= count) {
          resolve(aiSuggestions);
        } else {
          const fallback = generateSuggestions(interests, count);
          const combined = [...aiSuggestions];
          
          for (const suggestion of fallback) {
            if (combined.length >= count) break;
            if (!combined.includes(suggestion)) {
              combined.push(suggestion);
            }
          }
          
          resolve(combined.slice(0, count));
        }
      })
      .catch(() => {
        resolve(generateSuggestions(interests, count));
      });
  });
}