"use client";

type ProjectHeaderProps = {
  slug: string;
  title: string;
  status: string;
  statusColor: string;
  description: string;
};

export default function ProjectHeader({ slug, title, status, statusColor, description }: ProjectHeaderProps) {
  return (
    <div className="w-full max-w-6xl mb-6" style={{ viewTransitionName: `project-card-${slug}` }}>
      <div className="flex items-center gap-4 mb-4">
        <h1
          className="font-light tracking-wide text-white text-5xl md:text-6xl"
          style={{ viewTransitionName: `project-title-${slug}` }}
        >
          {title}
        </h1>
        <span
          className={`text-xs rounded border capitalize px-3 py-1.5 ${statusColor}`}
          style={{ viewTransitionName: `project-status-${slug}` }}
        >
          {status}
        </span>
      </div>
      <p
        className="text-zinc-400 leading-relaxed text-lg md:text-xl max-w-3xl"
        style={{ viewTransitionName: `project-description-${slug}` }}
      >
        {description}
      </p>
    </div>
  );
}
