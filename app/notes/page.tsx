import { Metadata } from "next";
import SectionLayout from "@/components/SectionLayout";
import NotesView from "@/components/NotesView";

export const metadata: Metadata = {
  title: "Notes - Alan See",
  description: "Quick thoughts, learnings, and TILs (Today I Learned) from Alan See. Short-form technical notes and observations.",
  keywords: "Alan See, notes, TIL, today I learned, quick thoughts, technical notes, learnings",
  openGraph: {
    title: "Notes - Alan See",
    description: "Quick thoughts, learnings, and TILs. Short-form technical notes and observations.",
    url: "https://alansee.dev/notes",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Notes - Alan See",
    description: "Quick thoughts and TILs. Short-form technical notes.",
  },
};

export default function NotesPage() {
  return (
    <SectionLayout title="Notes">
      <NotesView />
    </SectionLayout>
  );
}