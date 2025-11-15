import Shimmer from './Shimmer';

/**
 * Skeleton loading state for work item table rows
 * Matches the exact layout of WorkView table rows
 */
export default function WorkItemRowSkeleton() {
  return (
    <tr className="border-b border-zinc-800/50">
      {/* Time column */}
      <td className="py-3 pr-6 whitespace-nowrap align-top">
        <Shimmer className="h-4 w-32 rounded" />
      </td>

      {/* Project column */}
      <td className="py-3 pr-6 whitespace-nowrap align-top">
        <Shimmer className="h-4 w-40 rounded" />
      </td>

      {/* Summary column */}
      <td className="py-3 pr-6 align-top">
        <Shimmer className="h-4 w-full rounded" />
      </td>

      {/* Tags column */}
      <td className="py-3 align-top">
        <div className="flex gap-1.5 flex-wrap">
          <Shimmer className="h-5 w-16 rounded" />
          <Shimmer className="h-5 w-20 rounded" />
        </div>
      </td>
    </tr>
  );
}
