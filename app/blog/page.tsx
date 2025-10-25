import { Metadata } from "next";
import SectionLayout from "@/components/SectionLayout";
import BlogView from "@/components/BlogView";

export const metadata: Metadata = {
  title: "Blog - Alan See",
  description: "Thoughts and writings from Alan See on technology, software engineering, and life experiences.",
  keywords: "Alan See, blog, technology, software engineering, programming, technical writing, personal blog",
  openGraph: {
    title: "Blog - Alan See",
    description: "Thoughts and writings on technology, software engineering, and life experiences.",
    url: "https://alansee.dev/blog",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Blog - Alan See",
    description: "Thoughts and writings on technology and software engineering.",
  },
};

export default function BlogPage() {
  return (
    <SectionLayout title="Blog">
      <BlogView />
    </SectionLayout>
  );
}