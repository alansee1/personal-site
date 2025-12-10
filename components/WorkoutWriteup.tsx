"use client";

import PhaseCard from "./PhaseCard";

export default function WorkoutWriteup() {
  return (
    <div className="my-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white">
          What We (✨Claude✨) Built{" "}
          <span className="text-sm text-zinc-500 font-normal">
            — Claude also wrote this summary because I am incapable of writing
          </span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <PhaseCard number={1} title="Data Pipeline">
          <p>
            Two years of gym notes, zero consistency. Some days I'd write{" "}
            <code className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-sm font-mono">
              Bench - 190 5x8
            </code>
            , other days{" "}
            <code className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-sm font-mono">
              Bench: 5x8 190
            </code>{" "}
            with the order flipped. Pull-ups were just a list of reps:{" "}
            <code className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-sm font-mono">
              10, 8, 6, 5
            </code>
            . And I never once wrote the year.
          </p>
          <p>
            The parser handles 10+ format variations using sequential regex matching.
            It tracks context too - when it sees{" "}
            <code className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-sm font-mono">
              185 5x5
            </code>
            , it knows that's a pyramid set for whatever exercise came before.
          </p>
          <p className="text-sm text-zinc-400">
            <strong className="text-white">Result:</strong> 3,112 lines → <strong className="text-white">421 workouts</strong>, <strong className="text-white">2,305 exercises</strong>, normalized SQLite schema
          </p>
        </PhaseCard>

        <PhaseCard number={2} title="Progress Visualization">
          <p>
            With clean data, I used Remotion to generate a 30-second TikTok-style video
            (1080x1920, 30fps). Built in React with pure SVG - no charting libraries.
          </p>
          <p>
            The trickiest part was the animated weight chart. Two bugs kept breaking it:
            the Y-axis would jump as new data appeared (fixed by calculating scale upfront),
            and layout shifted at frame 60 (fixed by always rendering at least one point).
          </p>
          <p className="text-sm text-zinc-400">
            <strong className="text-white">Features:</strong> GitHub-style heatmap, animated weight chart (210→232.5 lbs),
            travel break highlights, TikTok-safe zones (12% top, 10% bottom)
          </p>
        </PhaseCard>
      </div>
    </div>
  );
}
