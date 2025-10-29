import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { supabaseClient } from "@/lib/supabase";
import WorkLogSection from "./WorkLogSection";
import ProjectHeader from "./ProjectHeader";
import ProjectContent from "./ProjectContent";
import BackButton from "./BackButton";
import "highlight.js/styles/github-dark.css";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  long_description: string | null;
  status: string;
  tech: string[];
  github: string | null;
  url: string | null;
  media: any[];
  start_date: string | null;
  end_date: string | null;
};

type WorkItem = {
  id: number;
  completed_at: string;
  started_at: string | null;
  status: string;
  project_id: number;
  summary: string;
  completed_summary: string | null;
  tags: string[];
};

// Fetch project from Supabase
async function getProject(slug: string): Promise<Project | null> {
  const { data, error } = await supabaseClient
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Project;
}

// Read markdown file
function getMarkdownContent(slug: string): string | null {
  try {
    const filePath = path.join(process.cwd(), 'content', 'projects', `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Remove frontmatter (everything between --- and ---)
    const content = fileContent.replace(/^---[\s\S]*?---\n/, '');

    return content.trim();
  } catch (error) {
    console.error('Error reading markdown:', error);
    return null;
  }
}

// Fetch work items for this project (completed only)
async function getProjectNotes(projectId: number): Promise<WorkItem[]> {
  const { data, error } = await supabaseClient
    .from('notes')
    .select('*')
    .eq('project_id', projectId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as WorkItem[];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id: slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Alan See`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Alan See`,
      description: project.description,
      type: 'article',
      url: `https://www.alansee.dev/projects/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | Alan See`,
      description: project.description,
    },
    keywords: [project.title, ...project.tech, 'project', 'portfolio'].join(', '),
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id: slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const markdownContent = getMarkdownContent(slug);
  const notes = await getProjectNotes(project.id);

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-900/30 text-emerald-300 border-emerald-800";
      case "completed":
        return "bg-blue-900/30 text-blue-300 border-blue-800";
      case "paused":
        return "bg-zinc-700/30 text-zinc-400 border-zinc-600";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full min-h-screen flex flex-col items-start pt-8 pl-8 pr-8 pb-16 overflow-y-auto overflow-x-hidden">
        {/* Back button */}
        <BackButton slug={slug} />

        {/* Project Header */}
        <ProjectHeader
          slug={slug}
          title={project.title}
          status={project.status}
          statusColor={getStatusColor(project.status)}
          description={project.description}
        />

        <ProjectContent
          tech={project.tech}
          url={project.url}
          github={project.github}
        />

        {/* Markdown Content */}
        {markdownContent ? (
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
              {markdownContent}
            </ReactMarkdown>
          </article>
        ) : (
          <div className="w-full max-w-4xl">
            <p className="text-zinc-500 italic">No detailed description available yet.</p>
          </div>
        )}

        {/* Work Log Section (Client Component) */}
        <WorkLogSection notes={notes} />
      </div>
    </div>
  );
}
