import { Metadata } from "next";
import { Suspense } from "react";
import SectionLayout from "@/components/SectionLayout";
import ShelfView from "@/components/ShelfView";

export const metadata: Metadata = {
  title: "Shelf - Alan See",
  description: "Books, articles, and media recommendations from Alan See. Curated reading list and content worth sharing.",
  keywords: "Alan See, shelf, books, reading list, recommendations, articles, media, curated content",
  openGraph: {
    title: "Shelf - Alan See",
    description: "Books, articles, and media recommendations. Curated reading list and content worth sharing.",
    url: "https://www.alansee.dev/shelf",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Shelf - Alan See",
    description: "Books, articles, and media recommendations.",
  },
};

export default function ShelfPage() {
  return (
    <SectionLayout title="Shelf">
      <Suspense fallback={<div>Loading...</div>}>
        <ShelfView />
      </Suspense>
    </SectionLayout>
  );
}