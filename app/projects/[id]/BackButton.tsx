"use client";

import { useRouter } from "next/navigation";
import { withViewTransition } from "@/lib/viewTransition";

type BackButtonProps = {
  onBackClick?: () => void;
};

export default function BackButton({ onBackClick }: BackButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    onBackClick?.();

    withViewTransition(() => {
      router.push("/projects");
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-white text-sm hover:text-zinc-400 transition-colors cursor-pointer mb-8"
    >
      ← back
    </button>
  );
}
