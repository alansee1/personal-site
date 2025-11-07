"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CosmicDriftPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/shelf?tab=games");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full h-screen flex flex-col">
        {/* Header with back button and title */}
        <div className="flex-shrink-0 pt-8 pl-8 pr-8 pb-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={handleBack}
            className="text-white text-sm hover:text-zinc-400 transition-colors mb-4 cursor-pointer"
          >
            ← back
          </motion.p>

          <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-2">
            Cosmic Drift
          </h1>
          <p className="text-zinc-500 text-sm">
            WASD/Arrows to move • Spacebar to boost • R/T to zoom
          </p>
        </div>

        {/* Game iframe - takes remaining space */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 px-8 pb-8"
        >
          <div className="w-full h-full rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
            <iframe
              src="https://cosmic-drift-delta.vercel.app"
              className="w-full h-full"
              style={{ border: "none" }}
              title="Cosmic Drift Game"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
