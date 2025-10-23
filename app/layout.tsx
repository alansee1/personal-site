import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alan See",
  description: "Making stuff on the internet. Explore projects, blog posts, resume, notes, and curated shelf of books and articles.",
  keywords: ["Alan See", "portfolio", "projects", "blog"],
  authors: [{ name: "Alan See" }],
  creator: "Alan See",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alansee.dev",
    siteName: "Alan See",
    title: "Alan See",
    description: "Making stuff on the internet. Explore projects, blog posts, resume, notes, and curated shelf of books and articles.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@seealanh",
    title: "Alan See",
    description: "Making stuff on the internet. Explore projects, blog posts, resume, notes, and curated shelf of books and articles.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://alansee.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Person Schema - helps Google understand Alan See is a real person */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Alan See",
              url: "https://alansee.dev",
              sameAs: [
                "https://github.com/alansee1",
                "https://www.linkedin.com/in/alan-see-880bb8140/",
                "https://twitter.com/seealanh",
              ],
              description: "Making stuff on the internet.",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
