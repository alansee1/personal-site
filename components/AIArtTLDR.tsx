"use client";

export default function AIArtTLDR() {
  return (
    <div className="my-12">
      <h2 className="text-2xl font-light text-white mb-2 text-center">TL;DR</h2>
      <p className="text-zinc-400 text-center mb-8">
        Text prompt → Stable Diffusion → Pretty picture
      </p>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
        {/* Prompt input mockup */}
        <div className="flex flex-col items-center">
          <div className="w-[280px] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl font-mono text-sm">
            {/* Terminal header */}
            <div className="bg-zinc-900 px-3 py-2 border-b border-zinc-800 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-zinc-500 text-xs ml-1">generate.py</span>
            </div>

            {/* Terminal content */}
            <div className="p-4 space-y-2">
              <div className="text-zinc-500">$ python generate.py \</div>
              <div className="text-green-400 pl-4">
                &quot;a lone astronaut standing
              </div>
              <div className="text-green-400 pl-4">
                on the edge of a massive
              </div>
              <div className="text-green-400 pl-4">
                crater on Mars, Earth visible
              </div>
              <div className="text-green-400 pl-4">
                in the pink sky, cinematic
              </div>
              <div className="text-green-400 pl-4">
                lighting, hyper detailed&quot; \
              </div>
              <div className="text-zinc-500 pl-4">
                --steps 50 --guidance 9
              </div>
              <div className="text-zinc-500 mt-3">Loading SD 2.1...</div>
              <div className="text-zinc-500">Using MPS (Apple Silicon)</div>
              <div className="text-zinc-500">Generating (50 steps)...</div>
              <div className="text-emerald-400 mt-2">✓ Saved to output/</div>
            </div>
          </div>
          <p className="mt-3 text-sm text-zinc-500 italic text-center">
            CLI prompt input
          </p>
        </div>

        {/* Arrow */}
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

        {/* Generated image */}
        <div className="flex flex-col items-center">
          <div className="w-auto h-[392px] rounded-xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900">
            <img
              src="/images/ai-art-sample.png"
              alt="AI generated art sample"
              className="h-full w-auto object-cover"
            />
          </div>
          <p className="mt-3 text-sm text-zinc-500 italic text-center">
            Generated output (512×512)
          </p>
        </div>
      </div>
    </div>
  );
}
