import Link from "next/link";
import type { Post } from "@/types/chat";

interface RelatedPostCardProps {
  posts: Post[];
}

export function RelatedPostCard({ posts }: RelatedPostCardProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="mt-4 mb-5">
      <div className="text-xs text-[#8C9A8F] mb-2 font-medium tracking-wide">
        相关文章
      </div>
      <div className="space-y-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/article/${post.slug}`}
            className="block bg-[#FAF6F1] rounded-xl p-4 hover:bg-[#F5EFE6] transition-colors border border-transparent hover:border-[#E8E0D5]"
          >
            <h4 className="text-sm font-medium text-[#5C4033] mb-1.5 leading-snug">
              {post.title}
            </h4>
            {post.excerpt && (
              <p className="text-xs text-[#8B7355] leading-relaxed line-clamp-2">
                {post.excerpt.length > 80
                  ? post.excerpt.slice(0, 80) + "..."
                  : post.excerpt}
              </p>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-1.5 mt-2.5">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-[#F0EBE3] text-[#8C9A8F] px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
