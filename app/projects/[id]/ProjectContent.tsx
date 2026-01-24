"use client";

type ProjectContentProps = {
  tech: string[];
  url: string | null;
  github: string | null;
};

export default function ProjectContent({ tech, url, github }: ProjectContentProps) {
  return (
    <div className="w-full max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Tech Stack */}
        <div>
          <h2 className="text-sm text-zinc-500 uppercase tracking-wider mb-3">Tech Stack</h2>
          <div className="flex gap-2 flex-wrap">
            {tech.map((t) => (
              <span
                key={t}
                className="text-sm px-3 py-1.5 bg-zinc-900 text-zinc-300 rounded border border-zinc-800"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        {(url || github) && (
          <div className="flex gap-3">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors text-sm font-medium"
              >
                View Live Site →
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 border border-zinc-700 text-white rounded-lg hover:border-zinc-500 transition-colors text-sm"
              >
                View on GitHub →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
