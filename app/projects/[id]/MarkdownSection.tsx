"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

type MarkdownSectionProps = {
  content: string;
};

export default function MarkdownSection({ content }: MarkdownSectionProps) {
  return (
    <article className="w-full max-w-4xl prose prose-invert prose-zinc max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ node, ...props }: any) => (
            <h1 className="text-3xl font-light text-white mt-12 mb-4" {...props} />
          ),
          h2: ({ node, ...props }: any) => (
            <h2 className="text-2xl font-light text-white mt-8 mb-4 first:mt-0" {...props} />
          ),
          h3: ({ node, ...props }: any) => (
            <h3 className="text-xl font-light text-white mt-8 mb-3" {...props} />
          ),
          p: ({ node, ...props }: any) => (
            <p className="text-zinc-300 leading-relaxed mb-6" {...props} />
          ),
          a: ({ node, ...props }: any) => (
            <a
              className="text-blue-400 hover:text-blue-300 underline transition-colors"
              {...props}
            />
          ),
          ul: ({ node, ...props }: any) => (
            <ul className="list-disc list-inside text-zinc-300 mb-6 space-y-2" {...props} />
          ),
          ol: ({ node, ...props }: any) => (
            <ol className="list-decimal list-inside text-zinc-300 mb-6 space-y-2" {...props} />
          ),
          li: ({ node, ...props }: any) => (
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
          pre: ({ node, ...props }: any) => (
            <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto mb-6 border border-zinc-800" {...props} />
          ),
          blockquote: ({ node, ...props }: any) => (
            <blockquote
              className="border-l-4 border-zinc-700 pl-4 italic text-zinc-400 my-6"
              {...props}
            />
          ),
          strong: ({ node, ...props }: any) => (
            <strong className="font-bold text-white" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
