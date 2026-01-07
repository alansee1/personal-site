"use client";

import PhaseCard from "./PhaseCard";

export default function AIArtWriteup() {
  return (
    <div className="my-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white">
          What We (✨Claude✨) Built{" "}
          <span className="text-sm text-zinc-500 font-normal">
            — an honest confession
          </span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <PhaseCard number={1} title="The Real Reason">
          <p>
            This project exists because I needed something to test
            the{" "}
            <code className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-sm font-mono">
              /add-work
            </code>{" "}
            and{" "}
            <code className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-sm font-mono">
              /log-work
            </code>{" "}
            slash commands I built for this site.
          </p>
          <p>
            I spent way more time perfecting the work tracking system than
            actually generating art. Turns out I&apos;m not good at art — even when the AI does most of the work.
          </p>
          <p className="text-sm text-zinc-400">
            <strong className="text-white">Time ratio:</strong> ~10% writing the
            CLI, ~90% testing slash commands with it as the guinea pig
          </p>
        </PhaseCard>

        <PhaseCard number={2} title="But It Actually Works">
          <p>
            The CLI does run Stable Diffusion 2.1 locally on Apple Silicon. No
            cloud APIs, no subscriptions — just your M-series GPU doing the heavy
            lifting via Metal Performance Shaders.
          </p>
          <p>
            It&apos;s nothing fancy: pass a prompt, wait ~30 seconds, get a 512×512
            image. But there&apos;s something satisfying about running AI models
            locally instead of paying per generation.
          </p>
          <p className="text-sm text-zinc-400">
            <strong className="text-white">Stack:</strong> Python, PyTorch, Hugging
            Face Diffusers, ~4GB VRAM on M3
          </p>
        </PhaseCard>
      </div>
    </div>
  );
}
