import { NextRequest, NextResponse } from "next/server";

/**
 * 简历上传 API
 * 
 * 支持多种存储方案：
 * 1. Vercel Blob (推荐用于 Vercel 部署)
 * 2. AWS S3 (通用方案)
 * 3. Cloudflare R2 (S3 兼容，免费额度大)
 * 4. Base64 存储 (演示模式)
 */

interface UploadProvider {
  upload(file: File, fileName: string): Promise<{ url: string }>;
}

class VercelBlobProvider implements UploadProvider {
  async upload(file: File, fileName: string): Promise<{ url: string }> {
    const { put } = await import("@vercel/blob");
    
    const blob = await put(fileName, file, {
      access: "public",
    });
    
    return { url: blob.url };
  }
}

class Base64Provider implements UploadProvider {
  async upload(file: File, fileName: string): Promise<{ url: string }> {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;
    
    return { url: dataUrl };
  }
}

class S3Provider implements UploadProvider {
  async upload(file: File, fileName: string): Promise<{ url: string }> {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    
    const client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    
    const arrayBuffer = await file.arrayBuffer();
    
    await client.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      Body: arrayBuffer,
      ContentType: file.type,
    }));
    
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    
    return { url };
  }
}

class CloudflareR2Provider implements UploadProvider {
  async upload(file: File, fileName: string): Promise<{ url: string }> {
    const { R2Bucket } = await import("cloudflare:R2");
    
    const bucket = new R2Bucket({ id: process.env.R2_BUCKET_ID! });
    
    const arrayBuffer = await file.arrayBuffer();
    await bucket.put(fileName, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });
    
    const url = `${process.env.R2_PUBLIC_URL}/${fileName}`;
    
    return { url };
  }
}

function getUploadProvider(): UploadProvider {
  const provider = process.env.UPLOAD_PROVIDER || "base64";
  
  switch (provider) {
    case "vercel-blob":
      return new VercelBlobProvider();
    case "aws-s3":
      return new S3Provider();
    case "cloudflare-r2":
      return new CloudflareR2Provider();
    case "base64":
    default:
      return new Base64Provider();
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "没有文件上传" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "只支持 PDF、Word、图片文件" },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "文件大小不能超过 10MB" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const fileName = `resume-${timestamp}.${extension}`;

    const provider = getUploadProvider();
    const { url } = await provider.upload(file, fileName);

    return NextResponse.json({
      success: true,
      url,
      fileName: file.name,
      size: file.size,
      message: "简历上传成功！",
    });
  } catch (error) {
    console.error("上传失败:", error);
    return NextResponse.json(
      { error: "上传失败，请重试" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
