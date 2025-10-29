"use client";

import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import blogData from "@/data/blog.json";
import BlogHeader from "./BlogHeader";
import "highlight.js/styles/github-dark.css";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostPage({ params }: PageProps) {
  const { slug } = React.use(params);
  const post = blogData.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Filter out unpublished posts in production
  if (process.env.NODE_ENV === "production" && !post.published) {
    notFound();
  }

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const readingTime = calculateReadingTime(post.content);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full min-h-screen flex flex-col items-start pt-8 pl-8 pr-8 pb-16 overflow-y-auto overflow-x-hidden">
        {/* Back link */}
        <Link
          href="/blog"
          className="text-white text-sm hover:text-zinc-400 transition-colors mb-8 cursor-pointer"
        >
          ← back
        </Link>

        {/* Article header */}
        <BlogHeader
          title={post.title}
          date={formatDate(post.date)}
          readingTime={readingTime}
          tags={post.tags}
        />

        {/* Article content */}
        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-4xl prose prose-invert prose-zinc max-w-none"
        >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-light text-white mt-12 mb-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-light text-white mt-10 mb-4" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-light text-white mt-8 mb-3" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-zinc-300 leading-relaxed mb-6" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                    {...props}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside text-zinc-300 mb-6 space-y-2" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside text-zinc-300 mb-6 space-y-2" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-zinc-300" {...props} />
                ),
                code: ({ node, ...props }: any) =>
                  props.inline ? (
                    <code
                      className="bg-zinc-900 text-zinc-300 px-1.5 py-0.5 rounded text-sm font-mono border border-zinc-800"
                      {...props}
                    />
                  ) : (
                    <code className="text-sm" {...props} />
                  ),
                pre: ({ node, ...props }) => (
                  <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto mb-6 border border-zinc-800" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-zinc-700 pl-4 italic text-zinc-400 my-6"
                    {...props}
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
        </motion.article>
      </div>
    </div>
  );
}
