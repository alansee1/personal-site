import Shimmer from './Shimmer';

/**
 * Skeleton loading state for project cards
 * Matches the exact layout of ProjectsView cards
 */
export default function ProjectCardSkeleton() {
  return (
    <div className="border border-zinc-800 rounded-lg p-6">
      {/* Top row: Title + Status badge */}
      <div className="flex items-start justify-between mb-3">
        <Shimmer className="h-8 w-64 rounded" />
        <Shimmer className="h-6 w-20 rounded" />
      </div>

      {/* Description (2 lines) */}
      <div className="space-y-2 mb-4">
        <Shimmer className="h-4 w-full rounded" />
        <Shimmer className="h-4 w-5/6 rounded" />
      </div>

      {/* Tech stack tags */}
      <div className="flex gap-2 flex-wrap mb-4">
        <Shimmer className="h-6 w-20 rounded" />
        <Shimmer className="h-6 w-24 rounded" />
        <Shimmer className="h-6 w-16 rounded" />
        <Shimmer className="h-6 w-28 rounded" />
      </div>

      {/* Bottom row: Links + Updated timestamp */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Shimmer className="h-4 w-20 rounded" />
          <Shimmer className="h-4 w-16 rounded" />
        </div>
        <Shimmer className="h-4 w-32 rounded" />
      </div>
    </div>
  );
}
