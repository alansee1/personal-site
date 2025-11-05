"use client";

type ViewTransitionCallback = () => void | Promise<void>;

/**
 * Starts a native view transition when supported, otherwise falls back to the callback.
 * Automatically respects prefers-reduced-motion and safely swallows transition errors.
 */
export function withViewTransition(callback: ViewTransitionCallback) {
  if (typeof document === "undefined") {
    callback();
    return;
  }

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const doc = document as DocumentWithViewTransition;
  const startTransition = typeof doc.startViewTransition === "function"
    ? doc.startViewTransition.bind(doc)
    : null;

  if (prefersReducedMotion || !startTransition) {
    callback();
    return;
  }

  const transition = startTransition(() => callback());

  transition?.finished.catch(() => {
    // Swallow errors from aborted transitions (e.g., rapid navigation spam)
  });
}

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: ViewTransitionCallback) => ViewTransition;
};

interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
}

declare module "react" {
  interface CSSProperties {
    viewTransitionName?: string;
  }
}

export {};
