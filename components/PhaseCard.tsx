"use client";

type PhaseCardProps = {
  number: number;
  title: string;
  children: React.ReactNode;
};

export default function PhaseCard({ number, title, children }: PhaseCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
          Phase {number}
        </span>
        <h3 className="text-lg font-medium text-white">{title}</h3>
      </div>
      <div className="text-zinc-300 leading-relaxed space-y-4">
        {children}
      </div>
    </div>
  );
}
