"use client";

import { useState } from "react";
import SectionLayout from "@/components/SectionLayout";
import ProjectsView from "@/components/ProjectsView";

export default function ProjectsPage() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  return (
    <SectionLayout title="Projects" isTransitioning={isTransitioning}>
      <ProjectsView onTransitionStart={() => setIsTransitioning(true)} />
    </SectionLayout>
  );
}
