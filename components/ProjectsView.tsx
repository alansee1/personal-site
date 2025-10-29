"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ProjectCardSkeleton from "./ProjectCardSkeleton";

type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  status: string;
  tech: string[];
  github: string | null;
  url: string | null;
  last_updated_at: string;
};

type ProjectsViewProps = {
  onTransitionStart?: () => void;
  isEmbedded?: boolean; // True when rendered in homepage, false when standalone /projects route
};

export default function ProjectsView({ onTransitionStart, isEmbedded = false }: ProjectsViewProps = {}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transitioningSlug, setTransitioningSlug] = useState<string | null>(null);
  const [morphTarget, setMorphTarget] = useState({ x: 0, y: 0, width: 0 });
  const [reverseAnimatingSlug, setReverseAnimatingSlug] = useState<string | null>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const router = useRouter();

  // Debug: log when transitioningSlug changes
  useEffect(() => {
    console.log('🔄 transitioningSlug changed:', transitioningSlug);
  }, [transitioningSlug]);

  // Check for reverse animation on mount
  useEffect(() => {
    const isReverseAnimation = sessionStorage.getItem('reverse-animation-active') === 'true';
    const slug = sessionStorage.getItem('reverse-animation-slug');

    if (isReverseAnimation && slug) {
      console.log('🔙 Reverse animation detected for:', slug);
      setReverseAnimatingSlug(slug);

      // Clear the flags
      sessionStorage.removeItem('reverse-animation-active');
      sessionStorage.removeItem('reverse-animation-slug');
    }
  }, []);

  // Trigger reverse animation after projects load
  useEffect(() => {
    if (reverseAnimatingSlug && !loading && projects.length > 0) {
      // Wait for card refs to be set
      setTimeout(() => {
        const cardElement = cardRefs.current[reverseAnimatingSlug];
        if (cardElement) {
          console.log('🎬 Starting reverse animation for:', reverseAnimatingSlug);

          // Start animation back to normal after a brief delay
          setTimeout(() => {
            setReverseAnimatingSlug(null);
          }, 100);
        }
      }, 50);
    }
  }, [reverseAnimatingSlug, loading, projects]);

  // Fetch projects from API
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const result = await response.json();
          setProjects(result.data || []);
        } else {
          setError('Failed to load projects');
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-900/30 text-emerald-300 border-emerald-800";
      case "completed":
        return "bg-blue-900/30 text-blue-300 border-blue-800";
      case "paused":
        return "bg-zinc-700/30 text-zinc-400 border-zinc-600";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      if (diffMins < 1) return "just now";
      return diffMins === 1 ? "1 minute ago" : `${diffMins} minutes ago`;
    }

    if (diffHours < 24) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    }

    if (diffDays < 7) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle project card click
  const handleProjectClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();

    // Calculate exact target position
    const cardElement = cardRefs.current[slug];
    if (cardElement) {
      const cardRect = cardElement.getBoundingClientRect();

      // Try to use measured position from detail page, fall back to estimates
      let targetTop = 88;
      let targetLeft = 32;
      let targetWidth = Math.min(window.innerWidth - 64, 896);

      const storedPosition = sessionStorage.getItem('project-header-position');
      if (storedPosition) {
        try {
          const measurements = JSON.parse(storedPosition);
          const cardPadding = 24;

          // If we have offset from back button, use that for more accuracy
          // But only if we're on standalone /projects route (not embedded in homepage)
          const useRelativePositioning = !isEmbedded && measurements.offsetFromBackButton;

          if (useRelativePositioning) {
            const backButton = document.querySelector('p.cursor-pointer, a[href="/projects"]');
            console.log('🔍 Back button search:', {
              found: !!backButton,
              selector: 'p.cursor-pointer, a[href="/projects"]',
              currentPath: window.location.pathname,
              isEmbedded,
              useRelativePositioning
            });

            if (backButton) {
              const backRect = backButton.getBoundingClientRect();
              console.log('📐 Back button position:', {
                top: Math.round(backRect.top),
                left: Math.round(backRect.left),
                tagName: backButton.tagName,
                className: backButton.className
              });

              // Calculate target based on back button position + offset - card padding + 1px adjustment
              targetTop = backRect.top + measurements.offsetFromBackButton.top - cardPadding - 1;
              targetLeft = backRect.left + measurements.offsetFromBackButton.left - cardPadding - 1;
              targetWidth = measurements.width;

              console.log('✅ Using back button relative positioning:', {
                targetTop,
                targetLeft,
                targetWidth,
                offset: measurements.offsetFromBackButton
              });
            } else {
              console.warn('⚠️ Back button not found! Using absolute positioning');
              targetTop = measurements.top - cardPadding - 1;
              targetLeft = measurements.left - cardPadding - 1;
              targetWidth = measurements.width;
            }
          } else {
            // Use absolute positioning when embedded in homepage or no offset available
            targetTop = measurements.top - cardPadding - 1;
            targetLeft = measurements.left - cardPadding - 1;
            targetWidth = measurements.width;
            console.log('📍 Using absolute positioning:', {
              isEmbedded,
              hasOffset: !!measurements.offsetFromBackButton,
              targetTop,
              targetLeft
            });
          }
        } catch (e) {
          console.warn('Failed to parse stored header position');
        }
      } else {
        console.warn('⚠️ No stored position found, using estimates');
      }

      const morphDeltas = {
        x: targetLeft - cardRect.left,
        y: targetTop - cardRect.top,
        width: targetWidth
      };

      setMorphTarget(morphDeltas);
    }

    setTransitioningSlug(slug);

    // Notify parent that transition started
    if (onTransitionStart) {
      onTransitionStart();
    }

    // Log initial card state
    const initialCardElement = cardRefs.current[slug];
    if (initialCardElement) {
      const flexContainer = initialCardElement.querySelector('.flex');
      const titleElement = initialCardElement.querySelector('h3');
      const badgeElement = initialCardElement.querySelector('span');

      if (flexContainer && titleElement && badgeElement) {
        const flexRect = flexContainer.getBoundingClientRect();
        const titleRect = titleElement.getBoundingClientRect();
        const badgeRect = badgeElement.getBoundingClientRect();
        const titleStyles = window.getComputedStyle(titleElement);
        const flexStyles = window.getComputedStyle(flexContainer);

        console.log('🚀 INITIAL CARD STATE (t=0ms):', {
          flexContainer: {
            width: Math.round(flexRect.width),
            left: Math.round(flexRect.left),
            gap: flexStyles.gap,
            justifyContent: flexStyles.justifyContent,
          },
          title: {
            width: Math.round(titleRect.width),
            left: Math.round(titleRect.left),
            fontSize: titleStyles.fontSize,
            flex: titleStyles.flex,
            flexGrow: titleStyles.flexGrow,
            flexShrink: titleStyles.flexShrink,
            flexBasis: titleStyles.flexBasis,
          },
          badge: {
            width: Math.round(badgeRect.width),
            left: Math.round(badgeRect.left),
          }
        });
      }
    }

    // Timeline: 300ms fade + 500ms delay + 800ms morph = 1600ms
    // Check at end of morph (1400ms) to see if animation is complete
    setTimeout(() => {
      const cardElement = cardRefs.current[slug];
      if (cardElement) {
        const flexContainer = cardElement.querySelector('.flex');
        const titleElement = cardElement.querySelector('h3');
        const badgeElement = cardElement.querySelector('span');

        if (flexContainer && titleElement && badgeElement) {
          const flexRect = flexContainer.getBoundingClientRect();
          const titleRect = titleElement.getBoundingClientRect();
          const badgeRect = badgeElement.getBoundingClientRect();
          const titleStyles = window.getComputedStyle(titleElement);
          const flexStyles = window.getComputedStyle(flexContainer);

          console.log('📏 MORPHING STATE (t=1400ms - COMPLETE):', {
            flexContainer: {
              width: Math.round(flexRect.width),
              left: Math.round(flexRect.left),
              gap: flexStyles.gap,
            },
            title: {
              width: Math.round(titleRect.width),
              left: Math.round(titleRect.left),
              fontSize: titleStyles.fontSize,
              lineHeight: titleStyles.lineHeight,
              height: Math.round(titleRect.height),
              flex: titleStyles.flex,
              flexGrow: titleStyles.flexGrow,
              flexShrink: titleStyles.flexShrink,
              flexBasis: titleStyles.flexBasis,
            },
            badge: {
              width: Math.round(badgeRect.width),
              left: Math.round(badgeRect.left),
            },
            spacing: {
              gapBetween: Math.round(badgeRect.left - titleRect.right),
            }
          });
        }
      }
    }, 1400);

    // Navigate at 1200ms so page loads during morph
    setTimeout(() => {
      router.push(`/projects/${slug}`);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl">
        <div className="space-y-6">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="w-full max-w-4xl">
        <p className="text-zinc-400">No projects yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="space-y-6">
        {projects.map((project) => {
          const isTransitioning = transitioningSlug === project.slug;
          const isReverseAnimating = reverseAnimatingSlug === project.slug;
          const shouldFadeOut = transitioningSlug && !isTransitioning;
          const shouldStartHidden = reverseAnimatingSlug && !isReverseAnimating;

          return (
            <motion.div
              key={project.id}
              ref={(el) => { cardRefs.current[project.slug] = el; }}
              initial={{
                opacity: shouldStartHidden ? 0 : 1
              }}
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
              onClick={(e) => handleProjectClick(e, project.slug)}
              className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 cursor-pointer hover:bg-zinc-900/30"
              style={{
                pointerEvents: transitioningSlug ? 'none' : 'auto',
                position: 'relative',
                zIndex: isTransitioning ? 50 : 1,
              }}
            >
                <motion.div
                  className="flex items-start justify-between mb-3"
                  initial={{
                    marginBottom: isReverseAnimating ? '24px' : '12px',
                    width: 'auto',
                  }}
                  animate={{
                    marginBottom: isTransitioning ? '24px' : '12px',
                    width: isTransitioning ? morphTarget.width : 'auto',
                  }}
                  transition={{
                    marginBottom: { duration: 0.8, delay: isReverseAnimating ? 0 : 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                    width: { duration: 0.8, delay: isReverseAnimating ? 0 : 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                  }}
                >
                  <motion.h3
                    className="font-light text-white overflow-visible tracking-wide"
                    initial={{
                      fontSize: isReverseAnimating ? '60px' : '24px',
                      lineHeight: isReverseAnimating ? '60px' : '24px',
                      flex: isReverseAnimating ? '0 1 auto' : '1 1 0%',
                    }}
                    animate={{
                      fontSize: isTransitioning ? '60px' : '24px', // text-2xl (24px) → text-6xl (60px)
                      lineHeight: isTransitioning ? '60px' : '24px', // Match h1 line-height of 1
                      flex: isTransitioning ? '0 1 auto' : '1 1 0%', // Match detail page h1 flex
                    }}
                    transition={{
                      fontSize: { duration: 0.8, delay: isReverseAnimating ? 0 : 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                      lineHeight: { duration: 0.8, delay: isReverseAnimating ? 0 : 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                      flex: { duration: 0.8, delay: isReverseAnimating ? 0 : 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                    }}
                  >
                    {project.title}
                  </motion.h3>
                  <motion.span
                    className={`text-xs rounded border capitalize ${getStatusColor(project.status)}`}
                    initial={{
                      paddingLeft: isReverseAnimating ? '12px' : '8px',
                      paddingRight: isReverseAnimating ? '12px' : '8px',
                      paddingTop: isReverseAnimating ? '6px' : '4px',
                      paddingBottom: isReverseAnimating ? '6px' : '4px',
                    }}
                    animate={{
                      paddingLeft: isTransitioning ? '12px' : '8px', // px-2 (8px) → px-3 (12px)
                      paddingRight: isTransitioning ? '12px' : '8px',
                      paddingTop: isTransitioning ? '6px' : '4px', // py-1 (4px) → py-1.5 (6px)
                      paddingBottom: isTransitioning ? '6px' : '4px',
                    }}
                    transition={{
                      paddingLeft: { duration: 0.8, delay: isReverseAnimating ? 0 : 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                      paddingRight: { duration: 0.8, delay: isReverseAnimating ? 0 : 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                      paddingTop: { duration: 0.8, delay: isReverseAnimating ? 0 : 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                      paddingBottom: { duration: 0.8, delay: isReverseAnimating ? 0 : 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                    }}
                  >
                    {project.status}
                  </motion.span>
                </motion.div>

                <motion.p
                  className="text-zinc-400 mb-4 overflow-visible"
                  initial={{
                    fontSize: isReverseAnimating ? '20px' : '16px',
                  }}
                  animate={{
                    fontSize: isTransitioning ? '20px' : '16px', // base (16px) → text-xl (20px)
                  }}
                  transition={{
                    fontSize: { duration: 0.8, delay: isReverseAnimating ? 0 : 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                  }}
                >
                  {project.description}
                </motion.p>

                <motion.div
                  initial={{
                    opacity: isReverseAnimating ? 0 : 1,
                    height: isReverseAnimating ? 0 : 'auto',
                  }}
                  animate={{
                    opacity: isTransitioning ? 0 : 1,
                    height: isTransitioning ? 0 : 'auto',
                  }}
                  transition={{ duration: isReverseAnimating ? 0.8 : 0.2, delay: isReverseAnimating ? 0.3 : 0 }}
                  className="flex gap-2 flex-wrap mb-4"
                >
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-1 bg-zinc-900 text-zinc-300 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{
                    opacity: isReverseAnimating ? 0 : 1,
                    height: isReverseAnimating ? 0 : 'auto',
                  }}
                  animate={{
                    opacity: isTransitioning ? 0 : 1,
                    height: isTransitioning ? 0 : 'auto',
                  }}
                  transition={{ duration: isReverseAnimating ? 0.8 : 0.2, delay: isReverseAnimating ? 0.3 : 0 }}
                  className="flex items-center justify-between text-xs text-zinc-500"
                >
                  <div className="flex gap-4">
                    {project.url && (
                      <span className="flex items-center gap-1">
                        <span>🔗</span>
                        <span>Live site</span>
                      </span>
                    )}
                    {project.github && (
                      <span className="flex items-center gap-1">
                        <span>📦</span>
                        <span>GitHub</span>
                      </span>
                    )}
                  </div>
                  <span className="text-zinc-600">
                    Updated {formatRelativeTime(project.last_updated_at)}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
    </div>
  );
}
