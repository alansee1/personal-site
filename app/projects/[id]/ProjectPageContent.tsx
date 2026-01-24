"use client";

import ProjectHeader from "./ProjectHeader";
import ProjectContent from "./ProjectContent";
import BackButton from "./BackButton";
import ProjectTabs from "./ProjectTabs";

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
  media: unknown[];
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
  created_at: string;
};

interface ProjectPageContentProps {
  project: Project;
  markdownContent: string | null;
  notes: WorkItem[];
  pendingWork: WorkItem[];
  statusColor: string;
}

export default function ProjectPageContent({
  project,
  markdownContent,
  notes,
  pendingWork,
  statusColor,
}: ProjectPageContentProps) {
  return (
    <>
      {/* Back button - left aligned */}
      <BackButton />

      {/* Centered content container */}
      <div className="w-full flex flex-col items-center">
        {/* Project Header */}
        <ProjectHeader
          slug={project.slug}
          title={project.title}
          status={project.status}
          statusColor={statusColor}
          description={project.description}
        />

        <ProjectContent
          tech={project.tech}
          url={project.url}
          github={project.github}
        />

        {/* Main Tabs - Overview & Work Items */}
        <ProjectTabs
          markdownContent={markdownContent}
          pendingWork={pendingWork}
          completedWork={notes}
        />
      </div>
    </>
  );
}
