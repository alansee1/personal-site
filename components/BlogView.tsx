"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BlogPostMetadata } from "@/lib/blog";
import blogData from "@/data/blog.json";

interface BlogViewProps {
  posts?: BlogPostMetadata[];
  onTransitionStart?: () => void;
  isEmbedded?: boolean; // True when rendered in homepage, false when standalone /blog route
  skipReverseAnimation?: boolean; // True when rendering during section exit animation (fromDirect return)
}

export default function BlogView({ posts, onTransitionStart, isEmbedded = false, skipReverseAnimation = false }: BlogViewProps) {
  const [transitioningSlug, setTransitioningSlug] = useState<string | null>(null);
  const [morphTarget, setMorphTarget] = useState({ x: 0, y: 0, width: 0 });
  const cardRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const router = useRouter();

  // Use provided posts or fall back to blog.json (for client-side rendering from homepage)
  const displayPosts = posts || blogData.filter((post) => {
    // Filter out unpublished posts in production
    if (process.env.NODE_ENV === 'production') {
      return post.published;
    }
    return true;
  });

  // Handle blog card click
  const handleBlogClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();

    const cardElement = cardRefs.current[slug];
    if (cardElement) {
      const cardRect = cardElement.getBoundingClientRect();

      // Try to use measured position from detail page
      let targetTop = 88;
      let targetLeft = 32;
      let targetWidth = Math.min(window.innerWidth - 64, 896);

      const storedPosition = sessionStorage.getItem('blog-header-position');
      if (storedPosition) {
        try {
          const measurements = JSON.parse(storedPosition);
          const cardPadding = 24;

          const useRelativePositioning = !isEmbedded && measurements.offsetFromBackButton;

          if (useRelativePositioning) {
            const backButton = document.querySelector('a[href="/blog"]');

            if (backButton) {
              const backRect = backButton.getBoundingClientRect();

              targetTop = backRect.top + measurements.offsetFromBackButton.top - cardPadding - 1;
              targetLeft = backRect.left + measurements.offsetFromBackButton.left - cardPadding - 1;
              targetWidth = measurements.width;
            } else {
              targetTop = measurements.top - cardPadding - 1;
              targetLeft = measurements.left - cardPadding - 1;
              targetWidth = measurements.width;
            }
          } else {
            targetTop = measurements.top - cardPadding - 1;
            targetLeft = measurements.left - cardPadding - 1;
            targetWidth = measurements.width;
          }
        } catch (e) {
          // Silently fall back to defaults
        }
      }

      const morphDeltas = {
        x: targetLeft - cardRect.left,
        y: targetTop - cardRect.top,
        width: targetWidth
      };

      setMorphTarget(morphDeltas);
    }

    setTransitioningSlug(slug);

    if (onTransitionStart) {
      onTransitionStart();
    }

    // Navigate at 1200ms so page loads during morph
    setTimeout(() => {
      router.push(`/blog/${slug}`);
    }, 1200);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (displayPosts.length === 0) {
    return (
      <div className="w-full max-w-4xl">
        <div className="border border-zinc-800 rounded-lg p-12 text-center">
          <p className="text-zinc-500 text-lg">No blog posts yet. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="space-y-6">
        {displayPosts.map((post) => {
          const isTransitioning = transitioningSlug === post.slug;
          const shouldFadeOut = transitioningSlug && !isTransitioning;

          return (
            <motion.article
              key={post.slug}
              ref={(el) => { cardRefs.current[post.slug] = el; }}
              initial={{ opacity: 1 }}
              animate={{
                opacity: shouldFadeOut ? 0 : 1,
                x: isTransitioning ? morphTarget.x : 0,
                y: isTransitioning ? morphTarget.y : 0,
                width: isTransitioning ? morphTarget.width : 'auto',
                borderColor: isTransitioning ? 'rgba(39, 39, 42, 0)' : 'rgba(39, 39, 42, 1)',
              }}
              transition={{
                opacity: { duration: 0.3 },
                borderColor: { duration: 0.3 },
                x: { duration: 0.8, delay: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                y: { duration: 0.8, delay: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                width: { duration: 0.8, delay: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
              }}
              onClick={(e) => handleBlogClick(e, post.slug)}
              className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 cursor-pointer hover:bg-zinc-900/30"
              style={{
                pointerEvents: transitioningSlug ? 'none' : 'auto',
                position: 'relative',
                zIndex: isTransitioning ? 50 : 1,
              }}
            >
              {/* Title */}
              <motion.h2
                className="font-light text-white tracking-wide mb-6"
                initial={{
                  fontSize: '24px',
                  lineHeight: '24px',
                }}
                animate={{
                  fontSize: isTransitioning ? '60px' : '24px',
                  lineHeight: isTransitioning ? '60px' : '24px',
                }}
                transition={{
                  fontSize: { duration: 0.8, delay: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                  lineHeight: { duration: 0.8, delay: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                }}
              >
                {post.title}
              </motion.h2>

              {/* Date */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 mb-6">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      className="text-xs bg-zinc-900 text-zinc-300 rounded border border-zinc-800"
                      initial={{
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        paddingTop: '4px',
                        paddingBottom: '4px',
                      }}
                      animate={{
                        paddingLeft: isTransitioning ? '12px' : '8px',
                        paddingRight: isTransitioning ? '12px' : '8px',
                        paddingTop: isTransitioning ? '6px' : '4px',
                        paddingBottom: isTransitioning ? '6px' : '4px',
                      }}
                      transition={{
                        paddingLeft: { duration: 0.8, delay: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                        paddingRight: { duration: 0.8, delay: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                        paddingTop: { duration: 0.8, delay: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                        paddingBottom: { duration: 0.8, delay: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                      }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              )}
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
