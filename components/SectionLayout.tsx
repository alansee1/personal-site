"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface SectionLayoutProps {
  title: string;
  children: ReactNode;
  isTransitioning?: boolean;
}

export default function SectionLayout({ title, children, isTransitioning = false }: SectionLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    // Navigate to homepage and trigger the morph animation
    router.push("/?returning=true&from=" + title.toLowerCase() + "&fromDirect=true");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full min-h-screen flex flex-col items-start pt-8 pl-8 pr-8 pb-16 overflow-y-auto">
        {/* Back button - keep visible during transition as stable reference */}
        <motion.p
          onClick={handleBack}
          className="text-white text-sm hover:text-zinc-400 transition-colors mb-8 cursor-pointer"
        >
          ← back
        </motion.p>

        {/* Section header */}
        <motion.h1
          animate={{ opacity: isTransitioning ? 0 : 1 }}
          transition={{ opacity: { duration: 0.3 } }}
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
  );
}