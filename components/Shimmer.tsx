interface ShimmerProps {
  className?: string;
}

/**
 * Base shimmer loading component with animated gradient effect
 * Uses zinc color palette to match site's dark theme
 */
export default function Shimmer({ className = '' }: ShimmerProps) {
  return (
    <div
      className={`animate-shimmer bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-[length:200%_100%] ${className}`}
    />
  );
}
