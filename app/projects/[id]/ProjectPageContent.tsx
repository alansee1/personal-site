"use client";

import { useState } from "react";
import WorkLogSection from "./WorkLogSection";
import ProjectHeader from "./ProjectHeader";
import ProjectContent from "./ProjectContent";
import BackButton from "./BackButton";
import MarkdownSection from "./MarkdownSection";

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

interface ProjectPageContentProps {
  project: Project;
  markdownContent: string | null;
  notes: WorkItem[];
  statusColor: string;
}

export default function ProjectPageContent({
  project,
  markdownContent,
  notes,
  statusColor,
}: ProjectPageContentProps) {
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  const handleBackClick = () => {
    setIsNavigatingBack(true);
  };

  return (
    <>
      {/* Back button */}
      <BackButton slug={project.slug} onBackClick={handleBackClick} />

      {/* Project Header */}
      <ProjectHeader
        slug={project.slug}
        title={project.title}
        status={project.status}
        statusColor={statusColor}
        description={project.description}
        isNavigatingBack={isNavigatingBack}
      />

      <ProjectContent
        tech={project.tech}
        url={project.url}
        github={project.github}
        isNavigatingBack={isNavigatingBack}
      />

      {/* Markdown Content */}
      {markdownContent && (
        <MarkdownSection content={markdownContent} isNavigatingBack={isNavigatingBack} />
      )}

      {/* Work Log Section (Client Component) */}
      <WorkLogSection notes={notes} isNavigatingBack={isNavigatingBack} />
    </>
  );
}
