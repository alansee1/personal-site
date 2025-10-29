"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

type BlogHeaderProps = {
  title: string;
  date: string;
  readingTime: number;
  tags: string[];
};

export default function BlogHeader({ title, date, readingTime, tags }: BlogHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);

  // Measure and store the actual rendered position for morph calculations
  useEffect(() => {
    // Immediate measurement with super logging
    if (headerRef.current) {
      const h1 = headerRef.current.querySelector('h1');

      if (h1) {
        const h1Rect = h1.getBoundingClientRect();
        const h1Styles = window.getComputedStyle(h1);

        console.log('🎯 BLOG DETAIL TARGET STATE (immediate):', {
          h1: {
            width: Math.round(h1Rect.width),
            left: Math.round(h1Rect.left),
            top: Math.round(h1Rect.top),
            height: Math.round(h1Rect.height),
            fontSize: h1Styles.fontSize,
            lineHeight: h1Styles.lineHeight,
          }
        });
      }
    }

    const timer = setTimeout(() => {
      if (headerRef.current) {
        const backButton = document.querySelector('a[href="/blog"]');
        const h1 = headerRef.current.querySelector('h1');

        if (backButton && h1) {
          const backRect = backButton.getBoundingClientRect();
          const h1Rect = h1.getBoundingClientRect();

          const offsetFromBack = {
            top: h1Rect.top - backRect.top,
            left: h1Rect.left - backRect.left
          };

          const measurements = {
            top: h1Rect.top,
            left: h1Rect.left,
            width: h1Rect.width,
            height: h1Rect.height,
            offsetFromBackButton: offsetFromBack
          };
          sessionStorage.setItem('blog-header-position', JSON.stringify(measurements));

          console.log('💾 Stored blog header position:', measurements);
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      ref={headerRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full max-w-4xl mb-12"
    >
      <h1 className="text-5xl md:text-6xl font-light tracking-wide text-white mb-6">
        {title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 mb-6">
        <time dateTime={date}>{date}</time>
        <span>•</span>
        <span>{readingTime} min read</span>
      </div>

      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1.5 bg-zinc-900 text-zinc-300 rounded border border-zinc-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
