import { Metadata } from "next";
import SectionLayout from "@/components/SectionLayout";
import ResumeView from "@/components/ResumeView";

export const metadata: Metadata = {
  title: "About - Alan See",
  description: "Professional experience and timeline of Alan See. Senior Application Support Engineer at Lively with expertise in SQL, databases, and technical support. Previously at SAP and Logistics Health Inc.",
  keywords: "Alan See, about, Lively, SAP, SQL, database, application support engineer, senior engineer, technical support, Wisconsin, Pacific Crest Trail",
  openGraph: {
    title: "About - Alan See",
    description: "Professional experience and timeline. Senior Application Support Engineer at Lively with expertise in SQL and databases.",
    url: "https://www.alansee.dev/about",
    type: "profile",
  },
  twitter: {
    card: "summary",
    title: "About - Alan See",
    description: "Professional experience and timeline. Senior Application Support Engineer at Lively.",
  },
};

export default function AboutPage() {
  return (
    <SectionLayout title="About">
      <ResumeView />
    </SectionLayout>
  );
}