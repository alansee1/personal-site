"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

type ProjectHeaderProps = {
  slug: string;
  title: string;
  status: string;
  statusColor: string;
  description: string;
  isNavigatingBack?: boolean;
};

export default function ProjectHeader({ slug, title, status, statusColor, description, isNavigatingBack }: ProjectHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);

  // Measure and store the actual rendered position for morph calculations
  useEffect(() => {
    // Immediate measurement with super logging
    if (headerRef.current) {
      const h1 = headerRef.current.querySelector('h1');
      const badge = headerRef.current.querySelector('span');
      const flexContainer = headerRef.current.querySelector('div');

      if (h1 && badge && flexContainer) {
        const h1Rect = h1.getBoundingClientRect();
        const badgeRect = badge.getBoundingClientRect();
        const flexRect = flexContainer.getBoundingClientRect();
        const h1Styles = window.getComputedStyle(h1);
        const flexStyles = window.getComputedStyle(flexContainer);

        console.log('🎯 DETAIL PAGE TARGET STATE (immediate):', {
          flexContainer: {
            width: Math.round(flexRect.width),
            left: Math.round(flexRect.left),
            gap: flexStyles.gap,
            justifyContent: flexStyles.justifyContent,
          },
          h1: {
            width: Math.round(h1Rect.width),
            left: Math.round(h1Rect.left),
            top: Math.round(h1Rect.top),
            height: Math.round(h1Rect.height),
            fontSize: h1Styles.fontSize,
            lineHeight: h1Styles.lineHeight,
            flex: h1Styles.flex,
            flexGrow: h1Styles.flexGrow,
            flexShrink: h1Styles.flexShrink,
            flexBasis: h1Styles.flexBasis,
          },
          badge: {
            width: Math.round(badgeRect.width),
            left: Math.round(badgeRect.left),
          },
          spacing: {
            gapBetween: Math.round(badgeRect.left - h1Rect.right),
          }
        });
      }
    }

    const timer = setTimeout(() => {
      if (headerRef.current) {
        const backButton = document.querySelector('a[href="/projects"]');
        const flexContainer = headerRef.current.querySelector('div');
        const h1 = headerRef.current.querySelector('h1');

        if (backButton && flexContainer && h1) {
          const backRect = backButton.getBoundingClientRect();
          const containerRect = flexContainer.getBoundingClientRect();
          const h1Rect = h1.getBoundingClientRect();

          const offsetFromBack = {
            top: h1Rect.top - backRect.top,
            left: h1Rect.left - backRect.left
          };

          const measurements = {
            top: h1Rect.top,
            left: h1Rect.left,
            width: containerRect.width,
            height: h1Rect.height,
            offsetFromBackButton: offsetFromBack
          };
          sessionStorage.setItem('project-header-position', JSON.stringify(measurements));
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={headerRef} className="w-full max-w-4xl mb-6">
      <div className="flex items-start justify-between mb-6">
        <motion.h1
          initial={false}
          animate={isNavigatingBack ? {
            fontSize: "24px",
          } : undefined}
          transition={{ duration: 0.8 }}
          className="font-light tracking-wide text-white text-6xl"
        >
          {title}
        </motion.h1>
        <motion.span
          initial={false}
          animate={isNavigatingBack ? {
            paddingLeft: "8px",
            paddingRight: "8px",
            paddingTop: "4px",
            paddingBottom: "4px",
          } : undefined}
          transition={{ duration: 0.8 }}
          className={`text-xs rounded border capitalize px-3 py-1.5 ${statusColor}`}
        >
          {status}
        </motion.span>
      </div>
      <motion.p
        initial={false}
        animate={isNavigatingBack ? {
          fontSize: "16px",
        } : undefined}
        transition={{ duration: 0.8 }}
        className="text-zinc-400 leading-relaxed text-xl"
      >
        {description}
      </motion.p>
    </div>
  );
}
