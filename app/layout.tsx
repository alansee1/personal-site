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
  description: "Alan See - Building stuff on the internet. Explore projects, blog posts about web development, and developer tools.",
  keywords: ["Alan See", "developer", "portfolio", "projects", "blog", "web development", "Next.js", "TypeScript"],
  authors: [{ name: "Alan See" }],
  creator: "Alan See",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.alansee.dev",
    siteName: "Alan See",
    title: "Alan See",
    description: "Alan See - Building stuff on the internet. Explore projects, blog posts about web development, and developer tools.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@seealanh",
    title: "Alan See",
    description: "Alan See - Building stuff on the internet. Explore projects, blog posts about web development, and developer tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.alansee.dev",
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
              url: "https://www.alansee.dev",
              sameAs: [
                "https://github.com/alansee1",
                "https://www.linkedin.com/in/alan-see-880bb8140/",
                "https://twitter.com/seealanh",
              ],
              description: "Building stuff on the internet.",
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
