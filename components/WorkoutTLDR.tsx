"use client";

import NotesPreview from "./NotesPreview";
import DatabasePreview from "./DatabasePreview";

export default function WorkoutTLDR() {
  const Arrow = () => (
    <div className="flex items-center justify-center text-zinc-500">
      {/* Horizontal arrow for desktop */}
      <svg
        className="hidden lg:block w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
      {/* Vertical arrow for mobile */}
      <svg
        className="lg:hidden w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 13l-5 5m0 0l-5-5m5 5V6"
        />
      </svg>
    </div>
  );

  return (
    <div className="my-12">
      <h2 className="text-2xl font-light text-white mb-2 text-center">TL;DR</h2>
      <p className="text-zinc-400 text-center mb-8">Notes app to SQLite database to visualization</p>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6">
        {/* Notes mockup */}
        <div>
          <NotesPreview />
        </div>

        {/* First Arrow */}
        <Arrow />

        {/* Database preview */}
        <div>
          <DatabasePreview />
        </div>

        {/* Second Arrow */}
        <Arrow />

        {/* Video player */}
        <div className="flex flex-col items-center">
          <div className="w-[220px] h-[392px] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-black">
            <video
              src="/videos/gym-journey.mp4"
              controls
              playsInline
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="mt-3 text-sm text-zinc-500 italic text-center">30-second animated progress video</p>
        </div>
      </div>
    </div>
  );
}
