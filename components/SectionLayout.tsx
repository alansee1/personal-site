"use client";

import { motion, LayoutGroup } from "framer-motion";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { NAV_TIMING, EASINGS } from "@/lib/animations";

interface SectionLayoutProps {
  title: string;
  children: ReactNode;
}

export default function SectionLayout({ title, children }: SectionLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    // Navigate to homepage and trigger the morph animation
    router.push("/?returning=true&from=" + title.toLowerCase() + "&fromDirect=true");
  };

  return (
    <LayoutGroup>
      <div className="min-h-screen bg-black text-white">
        <div className="w-full min-h-screen flex flex-col items-start pt-8 pl-8 pr-8 pb-16 overflow-y-auto">
          {/* Back button */}
          <p
            onClick={handleBack}
            className="text-white text-sm hover:text-zinc-400 transition-colors mb-8 cursor-pointer"
          >
            ← back
          </p>

          {/* Section header with layoutId for morphing */}
          <motion.h1
            layoutId={title.toLowerCase()}
            transition={{
              layout: {
                duration: NAV_TIMING.MORPH_DURATION / 1000,
                ease: EASINGS.MORPH,
                delay: NAV_TIMING.MORPH_DELAY / 1000,
              }
            }}
            className="text-white text-5xl md:text-6xl font-light tracking-wide mb-12"
          >
            {title}
          </motion.h1>

          {/* Section content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </LayoutGroup>
  );
}