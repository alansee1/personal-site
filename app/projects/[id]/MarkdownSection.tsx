"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import NotesPreview from "@/components/NotesPreview";
import WorkoutProblemSection from "@/components/WorkoutProblemSection";
import WorkoutTLDR from "@/components/WorkoutTLDR";
import WhatWeBuiltHeader from "@/components/WhatWeBuiltHeader";
import WorkoutWriteup from "@/components/WorkoutWriteup";
import AIArtTLDR from "@/components/AIArtTLDR";
import AIArtWriteup from "@/components/AIArtWriteup";

type MarkdownSectionProps = {
  content: string;
};

// Map of available custom components
const customComponents: Record<string, React.ComponentType> = {
  NotesPreview,
  WorkoutProblemSection,
  WorkoutTLDR,
  WhatWeBuiltHeader,
  WorkoutWriteup,
  AIArtTLDR,
  AIArtWriteup,
};

// Shared markdown component styles
const markdownComponents = {
  h1: ({ node, ...props }: any) => (
    <h1 className="text-3xl font-light text-white mt-12 mb-4 text-center" {...props} />
  ),
  h2: ({ node, ...props }: any) => (
    <h2 className="text-2xl font-light text-white mt-8 mb-4 first:mt-0 text-center" {...props} />
  ),
  h3: ({ node, ...props }: any) => (
    <h3 className="text-xl font-light text-white mt-8 mb-3 text-center" {...props} />
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
  code: ({ node, inline, ...props }: any) =>
    inline ? (
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
};

export default function MarkdownSection({ content }: MarkdownSectionProps) {
  // Split content by component directives like [component:NotesPreview]
  const parts = content.split(/(\[component:\w+\])/g);

  return (
    <article className="w-full max-w-6xl prose prose-invert prose-zinc">
      {parts.map((part, index) => {
        // Check if this is a component directive
        const match = part.match(/\[component:(\w+)\]/);
        if (match) {
          const componentName = match[1];
          const Component = customComponents[componentName];
          if (Component) {
            return <Component key={index} />;
          }
          return null;
        }

        // Regular markdown content
        if (part.trim()) {
          return (
            <ReactMarkdown
              key={index}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={markdownComponents}
            >
              {part}
            </ReactMarkdown>
          );
        }

        return null;
      })}
    </article>
  );
}
