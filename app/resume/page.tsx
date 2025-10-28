import { Metadata } from "next";
import SectionLayout from "@/components/SectionLayout";
import ResumeView from "@/components/ResumeView";

export const metadata: Metadata = {
  title: "Resume - Alan See",
  description: "Professional experience and timeline of Alan See. Senior Application Support Engineer at Lively with expertise in SQL, databases, and technical support. Previously at SAP and Logistics Health Inc.",
  keywords: "Alan See, resume, Lively, SAP, SQL, database, application support engineer, senior engineer, technical support, Wisconsin, Pacific Crest Trail",
  openGraph: {
    title: "Resume - Alan See",
    description: "Professional experience and timeline. Senior Application Support Engineer at Lively with expertise in SQL and databases.",
    url: "https://www.alansee.dev/resume",
    type: "profile",
  },
  twitter: {
    card: "summary",
    title: "Resume - Alan See",
    description: "Professional experience and timeline. Senior Application Support Engineer at Lively.",
  },
};

export default function ResumePage() {
  return (
    <SectionLayout title="Resume">
      <ResumeView />
    </SectionLayout>
  );
}