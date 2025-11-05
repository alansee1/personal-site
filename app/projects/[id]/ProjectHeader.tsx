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
    <div className="w-full max-w-4xl mb-6" style={{ viewTransitionName: `project-card-${slug}` }}>
      <div className="flex items-start justify-between mb-6">
        <h1
          className="font-light tracking-wide text-white text-6xl"
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
        className="text-zinc-400 leading-relaxed text-xl"
        style={{ viewTransitionName: `project-description-${slug}` }}
      >
        {description}
      </p>
    </div>
  );
}
