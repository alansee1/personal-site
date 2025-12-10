"use client";

import NotesPreview from "./NotesPreview";

export default function WorkoutProblemSection() {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-light text-white mb-6 text-center">The Problem</h2>
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
        {/* Text content on the left */}
        <div className="lg:max-w-md">
          <p className="text-zinc-300 leading-relaxed text-lg">
            I had been tracking workouts in my Notes app since October 2023 - over 420 gym sessions with inconsistent formatting, varying weight notation, and zero ability to analyze progress or trends. The data was valuable but completely unusable.
          </p>
        </div>

        {/* Notes mockup on the right */}
        <div className="flex-shrink-0">
          <NotesPreview />
        </div>
      </div>
    </div>
  );
}
