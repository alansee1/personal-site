"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  slug: string;
};

export default function BackButton({ slug }: BackButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    console.log('🔙 Back button clicked, triggering reverse animation for:', slug);

    // Store reverse animation state
    sessionStorage.setItem('reverse-animation-slug', slug);
    sessionStorage.setItem('reverse-animation-active', 'true');

    // Navigate back to projects
    router.push('/projects');
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
