"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  slug: string;
  onBackClick?: () => void;
};

export default function BackButton({ slug, onBackClick }: BackButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    console.log('🔙 Back button clicked, triggering reverse animation for:', slug);

    // Notify parent to start fade-out
    if (onBackClick) {
      onBackClick();
    }

    // Store reverse animation state
    sessionStorage.setItem('reverse-animation-slug', slug);
    sessionStorage.setItem('reverse-animation-active', 'true');

    // Navigate back to projects after header morph completes (800ms)
    setTimeout(() => {
      router.push('/projects');
    }, 800);
  };

  return (
    <a
      onClick={handleClick}
      className="text-white text-sm hover:text-zinc-400 transition-colors mb-8 cursor-pointer inline-block"
    >
      ← back
    </a>
  );
}
