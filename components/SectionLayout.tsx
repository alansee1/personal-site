"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

interface SectionLayoutProps {
  title: string;
  children: ReactNode;
  isTransitioning?: boolean;
}

export default function SectionLayout({ title, children, isTransitioning = false }: SectionLayoutProps) {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    // Start exit animation (back button and content fade, header stays)
    setIsExiting(true);

    // Wait for fade out + buffer before navigation to ensure clean black screen
    setTimeout(() => {
      router.push("/?returning=true&from=" + title.toLowerCase() + "&fromDirect=true");
    }, 320); // 300ms fade + 20ms buffer for clean transition
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full min-h-screen flex flex-col items-start pt-8 pl-8 pr-8 pb-16 overflow-y-auto">
        {/* Back button - fade out but maintain layout space */}
        <motion.p
          animate={{ opacity: isExiting ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          onClick={handleBack}
          className="text-white text-sm hover:text-zinc-400 transition-colors mb-8 cursor-pointer"
          style={{
            pointerEvents: isExiting ? 'none' : 'auto',
            visibility: isExiting ? 'hidden' : 'visible'
          }}
        >
          ← back
        </motion.p>

        {/* Section header - stays visible during exit for seamless transition */}
        <motion.h1
          animate={{ opacity: isTransitioning ? 0 : 1 }}
          transition={{ opacity: { duration: 0.3 } }}
          className="text-white text-5xl md:text-6xl font-light tracking-wide mb-12"
        >
          {title}
        </motion.h1>

        {/* Section content - fade out but maintain layout space */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isExiting ? 0 : 1 }}
          transition={{ duration: isExiting ? 0.3 : 0.5, delay: isExiting ? 0 : 0.3 }}
          className="w-full"
          style={{ visibility: isExiting ? 'hidden' : 'visible' }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}