import { Metadata } from "next";
import SectionLayout from "@/components/SectionLayout";
import ProjectsView from "@/components/ProjectsView";

export const metadata: Metadata = {
  title: "Projects - Alan See",
  description: "Portfolio of projects and work by Alan See. Software engineering projects, web applications, and technical solutions.",
  keywords: "Alan See, projects, portfolio, software engineering, web development, applications, programming",
  openGraph: {
    title: "Projects - Alan See",
    description: "Portfolio of projects and work. Software engineering projects and technical solutions.",
    url: "https://alansee.dev/projects",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Projects - Alan See",
    description: "Portfolio of software engineering projects and technical solutions.",
  },
};

export default function ProjectsPage() {
  return (
    <SectionLayout title="Projects">
      <ProjectsView />
    </SectionLayout>
  );
}