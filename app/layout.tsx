import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "张海挺 · 记录思考，也记录生活",
  description: "我在记录一些还没完全想清楚的事情。也许这些文字会在未来的某一天，给你一些启发。",
  keywords: ["个人博客", "技术思考", "生活记录", "张海挺"],
  authors: [{ name: "张海挺" }],
  openGraph: {
    title: "张海挺 · 记录思考，也记录生活",
    description: "我在记录一些还没完全想清楚的事情。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}