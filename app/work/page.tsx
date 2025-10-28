import { Metadata } from "next";
import SectionLayout from "@/components/SectionLayout";
import NotesView from "@/components/NotesView";

export const metadata: Metadata = {
  title: "Work - Alan See",
  description: "Work log and completed tasks from Alan See. Track progress on projects and features built.",
  keywords: "Alan See, work log, completed tasks, project progress, development work",
  openGraph: {
    title: "Work - Alan See",
    description: "Work log and completed tasks. Track progress on projects and features.",
    url: "https://www.alansee.dev/work",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Work - Alan See",
    description: "Work log and completed tasks.",
  },
};

export default function WorkPage() {
  return (
    <SectionLayout title="Work">
      <NotesView />
    </SectionLayout>
  );
}