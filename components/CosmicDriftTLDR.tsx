"use client";

export default function CosmicDriftTLDR() {
  return (
    <div className="my-12">
      <h2 className="text-2xl font-light text-white mb-2 text-center">
        Gameplay
      </h2>
      <p className="text-zinc-400 text-center mb-8">
        Absorb smaller planets, avoid larger ones, be the last one standing
      </p>

      <div className="flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-2xl aspect-video rounded-xl overflow-hidden border border-zinc-800 shadow-2xl bg-black">
            <video
              src="/videos/cosmic-drift-gameplay.mov"
              controls
              playsInline
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="mt-3 text-sm text-zinc-500 italic text-center">
            Survival mode gameplay
          </p>
        </div>
      </div>
    </div>
  );
}
