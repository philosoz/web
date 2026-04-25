// 简历 API 公共模块
// 提供简历相关的类型定义和公共函数

import fs from "fs/promises";
import path from "path";

export interface ResumeMetadata {
  id: string;
  url: string;
  fileName: string;
  uploadedAt: string;
  isActive: boolean;
}

export interface MetadataStore {
  resumes: ResumeMetadata[];
}

export const UPLOAD_DIR = path.join(process.cwd(), "public", "resume");
export const METADATA_FILE = path.join(UPLOAD_DIR, ".metadata.json");

// 确保上传目录存在
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// 读取元数据
export async function readMetadata(): Promise<MetadataStore> {
  try {
    const data = await fs.readFile(METADATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { resumes: [] };
  }
}

// 写入元数据
export async function writeMetadata(metadata: MetadataStore): Promise<void> {
  await fs.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2), "utf-8");
}

// 生成唯一 ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// 获取简历列表
export async function getResumeList(): Promise<ResumeMetadata[]> {
  const metadata = await readMetadata();
  return metadata.resumes;
}

// 设置默认简历
export async function setDefaultResume(id: string): Promise<ResumeMetadata[]> {
  const metadata = await readMetadata();
  
  // 找到目标简历
  const targetResume = metadata.resumes.find(r => r.id === id);
  if (!targetResume) {
    throw new Error("简历不存在");
  }
  
  // 重置所有简历的 isActive 状态
  metadata.resumes.forEach(r => {
    r.isActive = r.id === id;
  });
  
  await writeMetadata(metadata);
  
  return metadata.resumes;
}

// 安全验证：确保文件名不包含路径遍历字符
export function sanitizeFilename(filename: string): string {
  // 移除所有路径分隔符和特殊字符
  return filename.replace(/[/\\:*?"<>|]/g, '_');
}

// 安全验证：确保路径在允许的目录内
export function safePathJoin(basePath: string, filename: string): string {
  const sanitized = sanitizeFilename(filename);
  const fullPath = path.join(basePath, sanitized);
  const normalized = path.normalize(fullPath);
  
  // 确保规范化后的路径仍然在 basePath 内
  if (!normalized.startsWith(basePath)) {
    throw new Error("非法文件路径");
  }
  
  return fullPath;
}

// 删除简历
export async function deleteResume(filename: string): Promise<ResumeMetadata[]> {
  const metadata = await readMetadata();
  
  // 找到要删除的简历
  const resumeIndex = metadata.resumes.findIndex(
    r => r.url.endsWith(filename) || r.fileName === filename
  );
  
  if (resumeIndex === -1) {
    throw new Error("简历不存在");
  }
  
  // 安全路径处理 - 防止路径遍历
  let filePath: string;
  try {
    filePath = safePathJoin(UPLOAD_DIR, filename);
  } catch {
    throw new Error("非法文件名");
  }
  
  try {
    await fs.unlink(filePath);
  } catch {
    console.error(`Failed to delete file: ${filePath}`);
  }
  
  // 从元数据中移除
  metadata.resumes.splice(resumeIndex, 1);
  await writeMetadata(metadata);
  
  return metadata.resumes;
}

// 添加简历
export async function addResume(
  fileName: string,
  url: string
): Promise<ResumeMetadata> {
  const metadata = await readMetadata();
  
  // 重置所有简历的 isActive 状态
  metadata.resumes.forEach(r => r.isActive = false);
  
  const resume: ResumeMetadata = {
    id: generateId(),
    url,
    fileName,
    uploadedAt: new Date().toISOString(),
    isActive: true,
  };
  
  metadata.resumes.push(resume);
  await writeMetadata(metadata);
  
  return resume;
}

// 允许的文件类型
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/jpg",
];

// 最大文件大小 (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// 文件 Magic Number 定义
const FILE_SIGNATURES: Record<string, number[]> = {
  'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
  'application/msword': [0xD0, 0xCF, 0x11, 0xE0], // OLE2 compound document
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [0x50, 0x4B, 0x03, 0x04], // PK (ZIP)
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  'image/jpg': [0xFF, 0xD8, 0xFF],
};

// 验证文件 magic number
async function validateMagicNumber(file: File, expectedType: string): Promise<boolean> {
  const signatures = FILE_SIGNATURES[expectedType];
  if (!signatures) return true;
  
  const headerBytes = await file.slice(0, signatures.length).arrayBuffer();
  const bytes = new Uint8Array(headerBytes);
  
  for (let i = 0; i < signatures.length; i++) {
    if (bytes[i] !== signatures[i]) {
      return false;
    }
  }
  
  return true;
}

// 验证文件
export async function validateFile(file: File): Promise<{ valid: boolean; error?: string }> {
  // MIME 类型验证
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: "只支持 PDF、Word、图片文件" };
  }
  
  // 文件大小验证
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "文件大小不能超过 10MB" };
  }
  
  // 文件大小为 0 的检查
  if (file.size === 0) {
    return { valid: false, error: "文件为空" };
  }
  
  // Magic Number 验证 - 确保文件内容与声称的类型匹配
  const isValidContent = await validateMagicNumber(file, file.type);
  if (!isValidContent) {
    return { valid: false, error: "文件内容与文件类型不匹配" };
  }
  
  return { valid: true };
}