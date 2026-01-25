"use client";

import PhaseCard from "./PhaseCard";

export default function CosmicDriftWriteup() {
  return (
    <div className="my-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white">
          What We Built{" "}
          <span className="text-sm text-zinc-500 font-normal">
            — my first game, somehow
          </span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <PhaseCard number={1} title="Unified Physics">
          <p>
            This started as a fishy clone — you know, the "big fish eats small
            fish" game. Somewhere along the way, fish became planets, and I
            thought: what if every planet had gravity? Suddenly we needed real
            physics — gravitational pull based on mass, inverse square law, the
            whole thing.
          </p>
          <p>
            Every celestial body follows the same rules:{" "}
            <code className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-sm font-mono">
              force = G × mass / distance²
            </code>
            . Get too close to a bigger planet and you'll get sucked in. But
            here's the fun part — the boost ability triples gravity effects.
            Great for vacuuming up food particles, terrifying near anything
            larger than you.
          </p>
          <p className="text-sm text-zinc-400">
            <strong className="text-white">The result:</strong> Food orbits
            planets, small bodies slingshot around large ones, and boosting near
            a giant is basically a death wish
          </p>
        </PhaseCard>

        <PhaseCard number={2} title="AI Ecosystem">
          <p>
            The AI isn't smart — it's just paranoid. Each bot constantly scans
            for two things: prey (anything 10% smaller) and threats (anything
            10% larger). Hunt the former, flee the latter.
          </p>
          <p>
            Add in boundary avoidance (the map shrinks battle-royale style) and
            boost decisions, and you get emergent behavior that feels alive.
            Planets cluster around food, scatter when a giant approaches, and
            occasionally pull off accidental slingshot maneuvers that look
            intentional.
          </p>
          <p className="text-sm text-zinc-400">
            <strong className="text-white">Fun bug:</strong> Early versions had
            AI boosting into gravity wells constantly. Turns out "always boost
            toward prey" doesn't work when prey is orbiting a sun
          </p>
        </PhaseCard>
      </div>

      <div className="mt-8 p-6 rounded-xl border border-zinc-800 bg-zinc-900/30">
        <h3 className="text-lg font-medium text-white mb-3">Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {["Vanilla JS", "HTML5 Canvas", "CSS3", "Vercel"].map((tech) => (
            <span
              key={tech}
              className="text-xs px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
        <p className="text-sm text-zinc-400 mt-4">
          No frameworks, no build step, just 1,700 lines of JavaScript and a lot
          of{" "}
          <code className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-sm font-mono">
            requestAnimationFrame
          </code>{" "}
          calls. Sometimes the old ways are the fun ways.
        </p>
      </div>
    </div>
  );
}
