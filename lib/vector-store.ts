// 向量存储模块
// 支持语义检索和关键词检索的混合搜索

import { createSimpleEmbedding, cosineSimilarity } from './embedding';

export interface Document {
  id: string;
  content: string;
  title?: string;
  category?: string;
  tags?: string[];
  embedding?: number[];
  metadata?: Record<string, unknown>;
}

export class VectorStore {
  private documents: Document[] = [];
  private embeddingDimension = 384;
  
  // 添加单个文档
  async addDocument(doc: Omit<Document, 'id' | 'embedding'>): Promise<string> {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const embedding = createSimpleEmbedding(doc.content, this.embeddingDimension);
    
    this.documents.push({
      ...doc,
      id,
      embedding,
    });
    
    return id;
  }
  
  // 批量添加文档
  async addDocuments(docs: Omit<Document, 'id' | 'embedding'>[]): Promise<string[]> {
    const ids: string[] = [];
    for (const doc of docs) {
      const id = await this.addDocument(doc);
      ids.push(id);
    }
    return ids;
  }
  
  // 语义搜索
  async search(query: string, topK: number = 5): Promise<Document[]> {
    if (this.documents.length === 0) {
      return [];
    }
    
    const queryEmbedding = createSimpleEmbedding(query, this.embeddingDimension);
    
    // 计算相似度分数
    const scored = this.documents.map(doc => {
      if (!doc.embedding) {
        // 如果没有预计算的embedding，实时计算
        doc.embedding = createSimpleEmbedding(doc.content, this.embeddingDimension);
      }
      
      const score = cosineSimilarity(queryEmbedding, doc.embedding!);
      return { doc, score };
    });
    
    // 排序并返回topK
    return scored
      .filter(s => s.score > 0.1) // 过滤低分结果
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(s => ({
        ...s.doc,
        metadata: {
          ...s.doc.metadata,
          similarityScore: s.score,
        } as Record<string, unknown>,
      }));
  }
  
  // 关键词搜索（BM25简化版）
  keywordSearch(query: string, topK: number = 5): Document[] {
    const keywords = query.toLowerCase().split(/\s+/);
    
    const scored = this.documents.map(doc => {
      const searchable = (
        doc.title + ' ' + 
        doc.content + ' ' + 
        (doc.tags || []).join(' ')
      ).toLowerCase();
      
      let score = 0;
      for (const keyword of keywords) {
        if (searchable.includes(keyword)) {
          score += 1;
        }
      }
      
      return { doc, score };
    });
    
    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(s => s.doc);
  }
  
  // 混合搜索（语义 + 关键词）
  async hybridSearch(query: string, topK: number = 5): Promise<Document[]> {
    // 并行执行两种搜索
    const [semanticResults, keywordResults] = await Promise.all([
      this.search(query, topK * 2),
      Promise.resolve(this.keywordSearch(query, topK * 2)),
    ]);
    
    // 去重并融合分数
    const seen = new Set<string>();
    const merged: Array<Document & { finalScore: number }> = [];
    
    // 优先添加语义结果
    for (const doc of semanticResults) {
      if (!seen.has(doc.id)) {
        seen.add(doc.id);
        const semanticScore = (doc.metadata?.similarityScore as number) || 0;
        merged.push({
          ...doc,
          finalScore: semanticScore * 0.7, // 语义权重 70%
        });
      }
    }
    
    // 添加关键词结果
    for (const doc of keywordResults) {
      if (!seen.has(doc.id)) {
        seen.add(doc.id);
        merged.push({
          ...doc,
          finalScore: 0.3, // 关键词基础分
        });
      } else {
        // 如果已存在，增加关键词分数
        const existing = merged.find(d => d.id === doc.id);
        if (existing) {
          existing.finalScore += 0.3;
        }
      }
    }
    
    // 按最终分数排序
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return merged
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, topK)
      .map(({ finalScore, ...doc }) => doc);
  }
  
  // 获取所有文档
  getAllDocuments(): Document[] {
    return [...this.documents];
  }
  
  // 获取文档数量
  getDocumentCount(): number {
    return this.documents.length;
  }
  
  // 清空所有文档
  clear(): void {
    this.documents = [];
  }
  
  // 导出索引（JSON格式）
  exportIndex(): string {
    return JSON.stringify({
      version: 1,
      dimension: this.embeddingDimension,
      documents: this.documents.map(d => ({
        ...d,
        embedding: d.embedding ? Array.from(d.embedding) : undefined,
      })),
    });
  }
  
  // 导入索引
  async importIndex(jsonString: string): Promise<void> {
    try {
      const data = JSON.parse(jsonString);
      this.embeddingDimension = data.dimension || 384;
      this.documents = data.documents.map((d: {id: string; content: string; title?: string; category?: string; tags?: string[]; metadata?: Record<string, unknown>; embedding?: number[]}) => ({
        ...d,
        embedding: d.embedding ? new Float32Array(d.embedding) : undefined,
      }));
    } catch (error) {
      console.error('Failed to import index:', error);
      throw new Error('Invalid index format');
    }
  }
}

// 全局向量存储实例
export const globalVectorStore = new VectorStore();
