"use client";

import Link from "next/link";
import { BlogPostMetadata } from "@/lib/blog";
import blogData from "@/data/blog.json";

interface BlogViewProps {
  posts?: BlogPostMetadata[];
}

export default function BlogView({ posts }: BlogViewProps) {
  // Use provided posts or fall back to blog.json (for client-side rendering from homepage)
  const displayPosts = posts || blogData.filter((post) => {
    // Filter out unpublished posts in production
    if (process.env.NODE_ENV === 'production') {
      return post.published;
    }
    return true;
  });
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (displayPosts.length === 0) {
    return (
      <div className="w-full max-w-4xl">
        <div className="border border-zinc-800 rounded-lg p-12 text-center">
          <p className="text-zinc-500 text-lg">No blog posts yet. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="space-y-6">
        {displayPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <article className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all cursor-pointer hover:bg-zinc-900/30">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-2xl font-light text-white">{post.title}</h2>
                {!post.published && (
                  <span className="text-xs px-2 py-1 rounded border bg-amber-900/30 text-amber-300 border-amber-800">
                    Draft
                  </span>
                )}
              </div>

              <p className="text-zinc-400 mb-4">{post.description}</p>

              <div className="flex gap-2 flex-wrap mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-zinc-900 text-zinc-300 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="text-xs text-zinc-500">
                {formatDate(post.date)}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
