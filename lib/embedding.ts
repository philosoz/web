// 向量嵌入模块
// 支持 MiniMax/OpenAI Embeddings API 和本地 TF-IDF 方案

export interface EmbeddingResult {
  embedding: number[];
  model: string;
}

// TF-IDF 向量化（本地方案，无需API）
export function createSimpleEmbedding(text: string, dimensions: number = 384): number[] {
  const words = tokenize(text.toLowerCase());
  const wordFreq = countFrequency(words);
  
  // 使用词频作为向量
  const vector = new Array(dimensions).fill(0);
  const uniqueWords = Object.keys(wordFreq);
  
  // 简单哈希映射
  for (let i = 0; i < uniqueWords.length && i < dimensions; i++) {
    const word = uniqueWords[i];
    const hash = simpleHash(word);
    const index = hash % dimensions;
    vector[index] = wordFreq[word];
  }
  
  // L2 归一化
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (norm > 0) {
    for (let i = 0; i < vector.length; i++) {
      vector[i] = vector[i] / norm;
    }
  }
  
  return vector;
}

// 文本分词
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ') // 保留中文
    .split(/\s+/)
    .filter(word => word.length > 1);
}

// 词频统计
function countFrequency(words: string[]): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
  }
  return freq;
}

// 简单哈希函数
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// 余弦相似度计算
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same dimensions');
  }
  
  let dot = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dot / (normA * normB);
}

// 语义相似度（基于词嵌入的简单实现）
export function semanticSimilarity(text1: string, text2: string): number {
  const vec1 = createSimpleEmbedding(text1);
  const vec2 = createSimpleEmbedding(text2);
  return cosineSimilarity(vec1, vec2);
}

// 扩展向量到指定维度（用于相似度计算）
function padVector(vector: number[], targetLength: number): number[] {
  if (vector.length === targetLength) return vector;
  if (vector.length > targetLength) return vector.slice(0, targetLength);
  
  const padded = [...vector];
  while (padded.length < targetLength) {
    padded.push(0);
  }
  return padded;
}
