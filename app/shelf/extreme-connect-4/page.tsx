"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ExtremeConnect4Page() {
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
            Extreme Connect 4
          </h1>
          <p className="text-zinc-500 text-sm">
            Choose Connect-4 through Connect-10 • Multiplayer ready • Auto-scaled boards
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
              src="https://extreme-connect-4.onrender.com"
              className="w-full h-full"
              style={{ border: "none" }}
              title="Extreme Connect 4 Game"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
