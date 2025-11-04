"use client";

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import ProjectsView from "@/components/ProjectsView";
import BlogView from "@/components/BlogView";
import ResumeView from "@/components/ResumeView";
import NotesView from "@/components/NotesView";
import ShelfView from "@/components/ShelfView";
import { ENTRY_TIMING, NAV_TIMING, EASINGS } from "@/lib/animations";

export default function Home() {
  const router = useRouter();

  // Track if component has mounted on client (prevents hydration mismatch)
  const [mounted, setMounted] = useState(false);

  // Check if user has seen animation in this session
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false);

  const [showLine, setShowLine] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [displayedName, setDisplayedName] = useState("");
  const [visibleDots, setVisibleDots] = useState(0);
  const [dotsActive, setDotsActive] = useState(false);
  const [keyPress, setKeyPress] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dropDots, setDropDots] = useState(false);
  const [expandLine, setExpandLine] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const fullName = "Alan See";

  // Section navigation state
  type Section = "projects" | "blog" | "about" | "work" | "shelf";
  type SectionType = Section | null;
  const [activeSection, setActiveSection] = useState<SectionType>(null);
  const [returningFrom, setReturningFrom] = useState<SectionType>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isDirectReturn, setIsDirectReturn] = useState(false); // True when returning from standalone page
  const [isAnimating, setIsAnimating] = useState(false); // Animation lock
  const [hideMorphedButton, setHideMorphedButton] = useState(false); // Hide button after morph completes
  const [isTransitioningToDetail, setIsTransitioningToDetail] = useState(false); // Track project/blog detail transitions

  // Mark component as mounted and check sessionStorage (runs first, prevents hydration mismatch)
  useEffect(() => {
    // Check URL params for returning from section
    const params = new URLSearchParams(window.location.search);
    const isReturning = params.get('returning') === 'true';
    const fromSection = params.get('from') as SectionType;

    // Check if we've seen the animation before
    const animationSeen = sessionStorage.getItem('animationSeen');

    // Check if we're triggering a reverse animation
    if (isReturning && fromSection) {
      const isFromDirect = params.get('fromDirect') === 'true';

      // Set up state for reverse animation
      setHasSeenAnimation(true);
      setShowLine(false);
      setShowContent(true);
      setDisplayedName(fullName);
      setTypingDone(true); // Keep typingDone true - isReturning handles visibility

      if (isFromDirect) {
        // Standalone faded content but kept header visible
        setHideMorphedButton(false); // Show button for morph
        setReturningFrom(fromSection);
        setIsReturning(true);
        setIsDirectReturn(true); // Flag so we don't render back button/content
        setActiveSection(fromSection); // Render section header immediately

        // Clean URL
        window.history.replaceState({}, '', '/');

        // Use double RAF to ensure header is painted before morphing (fixes Chrome production bug)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setActiveSection(null); // Clear to trigger morph

            // Wait for morph to complete
            setTimeout(() => {
              setIsReturning(false);
              setReturningFrom(null);
              setIsDirectReturn(false);
            }, NAV_TIMING.MORPH_DELAY + NAV_TIMING.MORPH_DURATION);
          });
        });
      } else {
        // For state-based navigation (from sessionStorage flag)
        setActiveSection(fromSection);
        setReturningFrom(fromSection);
        setHideMorphedButton(false); // Button should be visible for morph
        setIsExiting(true);
        setIsReturning(true);
        // typingDone remains true - isReturning handles hiding homepage during animation

        // Clean URL
        window.history.replaceState({}, '', '/');

        // Start the reverse animation sequence after mounting
        setTimeout(() => {
          setActiveSection(null);
          setIsExiting(false);
          setTimeout(() => {
            setIsReturning(false);
            setReturningFrom(null);
            sessionStorage.removeItem('inStateNavigation');
          }, 1400);
        }, 300);
      }
    } else if (animationSeen) {
      setHasSeenAnimation(true);
      setShowLine(false);
      setShowContent(true);
      setDisplayedName(fullName);
      setTypingDone(true);
    }

    // Mark as mounted - this allows the entrance animation to render (if needed)
    setMounted(true);
  }, [fullName]);

  useEffect(() => {
    // Skip animation if it was already seen in this session
    if (hasSeenAnimation) {
      return;
    }

    // Animation sequence for first-time visitors
    // Pop in dots one by one (with initial 300ms delay)
    const dotTimers = [0, 1, 2, 3, 4].map((index) =>
      setTimeout(() => {
        setVisibleDots(index + 1);
      }, 300 + index * 345)
    );

    // After all dots appear, turn them dark
    const activateTimer = setTimeout(() => {
      setDotsActive(true);
    }, 2025);

    // Key press down
    const keyPressTimer = setTimeout(() => {
      setKeyPress(true);
    }, 2370);

    // Show confetti
    const confettiTimer = setTimeout(() => {
      setShowConfetti(true);
    }, 2658);

    // Drop the dots
    const dropTimer = setTimeout(() => {
      setDropDots(true);
    }, 2945);

    // After dots drop, expand the line
    const expandTimer = setTimeout(() => {
      setExpandLine(true);
    }, 3520);

    // After line expands, show content
    const contentTimer = setTimeout(() => {
      setShowLine(false);
      setShowContent(true);
      // Mark animation as seen for this session
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('animationSeen', 'true');
      }
    }, 5820);

    return () => {
      dotTimers.forEach(clearTimeout);
      clearTimeout(activateTimer);
      clearTimeout(keyPressTimer);
      clearTimeout(confettiTimer);
      clearTimeout(dropTimer);
      clearTimeout(expandTimer);
      clearTimeout(contentTimer);
    };
  }, [hasSeenAnimation, fullName]);

  useEffect(() => {
    if (!showContent || hasSeenAnimation) return;

    // Typing effect for name (skip if animation was already seen)
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullName.length) {
        setDisplayedName(fullName.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
        setTypingDone(true);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [showContent, hasSeenAnimation, fullName]);

  // Section navigation handlers
  const handleSectionClick = (section: SectionType) => {
    if (isAnimating) return; // Prevent clicks during animation

    setIsAnimating(true);
    setHideMorphedButton(false); // Reset before new animation
    setActiveSection(section);
    // Mark animation as seen when user first navigates
    setHasSeenAnimation(true);
    // Mark that we're using state-based navigation
    sessionStorage.setItem('inStateNavigation', 'true');
    // Update URL without navigation (for bookmarking/sharing)
    window.history.pushState({}, '', `/${section}`);

    // Hide the morphed button after morph completes (add 100ms buffer for easing)
    setTimeout(() => setHideMorphedButton(true), NAV_TIMING.MORPH_DELAY + NAV_TIMING.MORPH_DURATION + 100);

    // Release lock after section entry completes
    setTimeout(() => setIsAnimating(false), NAV_TIMING.SECTION_ENTRY_DELAY + 500);
  };

  const handleBack = () => {
    if (isAnimating) return; // Prevent clicks during animation

    setIsAnimating(true);
    setHideMorphedButton(false); // Show button for return morph
    // Store the section we're returning from
    const currentSection = activeSection;
    setReturningFrom(currentSection);
    setIsExiting(true);
    setIsReturning(true);

    // Update URL back to homepage
    window.history.pushState({}, '', '/');

    // Wait for content to fade out, then trigger the morph
    setTimeout(() => {
      setActiveSection(null);
      setIsExiting(false);

      // Clear returning flag after morph animation completes
      setTimeout(() => {
        setIsReturning(false);
        setReturningFrom(null);
        sessionStorage.removeItem('inStateNavigation');
        setIsAnimating(false); // Release lock
      }, NAV_TIMING.HOME_FADE_IN_DELAY);
    }, NAV_TIMING.CONTENT_FADE_OUT);
  };

  // Watch for return navigation via URL params (from SectionLayout back buttons)
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const checkForReturnNavigation = () => {
      const params = new URLSearchParams(window.location.search);
      const isReturning = params.get('returning') === 'true';
      const fromSection = params.get('from') as SectionType;
      const isFromDirect = params.get('fromDirect') === 'true';

      if (isReturning && fromSection) {
        // Reset hideMorphedButton to ensure button is visible for morph
        setHideMorphedButton(true);
        setActiveSection(fromSection);
        setReturningFrom(fromSection);
        setIsExiting(false);
        setIsReturning(true);

        // Clean URL
        window.history.replaceState({}, '', '/');

        // Start return animation
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setHideMorphedButton(false); // Show for morph
            setIsExiting(true);

            setTimeout(() => {
              setActiveSection(null);
              setIsExiting(false);

              setTimeout(() => {
                setIsReturning(false);
                setReturningFrom(null);
                setTypingDone(true);
              }, NAV_TIMING.HOME_FADE_IN_DELAY);
            }, NAV_TIMING.CONTENT_FADE_OUT);
          });
        });
      }
    };

    // Check on mount and when URL changes
    checkForReturnNavigation();
    window.addEventListener('popstate', checkForReturnNavigation);
    return () => window.removeEventListener('popstate', checkForReturnNavigation);
  }, [mounted]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/' && activeSection) {
        // Browser back to homepage from section
        handleBack();
      } else if (path !== '/' && !activeSection) {
        // Browser forward to section
        const section = path.slice(1) as Section;
        if (section && ["projects", "blog", "about", "work", "shelf"].includes(section)) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeSection]);


  const socialLinks = [
    { name: "TikTok", icon: "fa6-brands:tiktok", href: "#" },
    { name: "LinkedIn", icon: "fa6-brands:linkedin", href: "https://www.linkedin.com/in/alan-see-880bb8140/" },
    { name: "X", icon: "fa6-brands:x-twitter", href: "https://twitter.com/seealanh" },
    { name: "Facebook", icon: "fa6-brands:facebook", href: "#" },
    { name: "GitHub", icon: "fa6-brands:github", href: "https://github.com/alansee1" },
  ];

  const sections = [
    { name: "Projects", id: "projects" },
    { name: "Blog", id: "blog" },
    { name: "About", id: "about" },
    { name: "Work", id: "work" },
    { name: "Shelf", id: "shelf" },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <LayoutGroup>
      <AnimatePresence>
        {mounted && showLine && !hasSeenAnimation && (
          <motion.div
            className="absolute inset-0 bg-white flex items-center justify-center"
            exit={{ opacity: 0 }}
          >
            {/* Black horizontal line that expands */}
            <motion.div
              className="bg-black w-screen"
              initial={{ height: "4px" }}
              animate={{ height: expandLine ? "100vh" : "4px" }}
              transition={{
                duration: 2,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
            />

            {/* Dots positioned over the line */}
            <div className="absolute flex flex-col items-center">
              <div className="h-1" />

              {/* Loading dots below the line */}
              <div className="flex gap-3 mt-8 relative">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={
                        index < visibleDots
                          ? {
                              scale: 1,
                              backgroundColor: dotsActive ? "#000000" : "#d4d4d8",
                              y: dropDots ? 1000 : keyPress ? [0, 4, 0] : 0,
                            }
                          : { scale: 0 }
                      }
                      transition={
                        dropDots
                          ? { y: { duration: 0.6, ease: "easeIn" } }
                          : keyPress
                          ? {
                              y: { duration: 0.25, times: [0, 0.5, 1] },
                              backgroundColor: { duration: 0.2 }
                            }
                          : { scale: { duration: 0.2 }, backgroundColor: { duration: 0.3 } }
                      }
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: "#d4d4d8" }}
                    />

                    {/* Confetti particles */}
                    {showConfetti && !dropDots && index < visibleDots && (
                      <>
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{
                              scale: 0,
                              x: 0,
                              y: 0,
                              opacity: 1
                            }}
                            animate={{
                              scale: [0, 1, 0],
                              x: [0, (Math.random() - 0.5) * 20],
                              y: [0, (Math.random() - 0.5) * 20],
                              opacity: [1, 1, 0]
                            }}
                            transition={{
                              duration: 0.4,
                              ease: "easeOut"
                            }}
                            className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-white"
                            style={{ marginLeft: '-2px', marginTop: '-2px' }}
                          />
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContent && (
          <motion.div
            key="home"
            initial={{ opacity: hasSeenAnimation ? 1 : 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-screen bg-black flex flex-col items-center justify-center gap-12"
            style={{ pointerEvents: activeSection ? "none" : "auto" }}
          >
            {/* Spacer - top */}
            <div className="flex-1" />

            {/* Typing name */}
            <motion.h1
              initial={{ opacity: (hasSeenAnimation && !isReturning) ? 1 : 0 }}
              animate={{ opacity: activeSection || isReturning ? 0 : 1 }}
              transition={{
                duration: 0.5,
                delay: activeSection ? 0 : (isReturning ? 1.4 : 0)
              }}
              className="text-white text-7xl md:text-8xl font-light tracking-wide"
            >
              {displayedName}
              {!typingDone && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                  className="inline-block w-1 h-16 bg-white ml-2 align-middle"
                />
              )}
            </motion.h1>

            {/* Social icons */}
            <div className="flex items-center gap-8 mb-6">
              {socialLinks.map((link, index) => {
                // Calculate delay - ensuring no stagger when returning
                const fadeInDelay = activeSection ? 0 : (isReturning ? NAV_TIMING.HOME_FADE_IN_DELAY / 1000 : (hasSeenAnimation ? 0 : (fullName.length + 1) * 0.1 + 0.3 + index * 0.1));

                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: (hasSeenAnimation && !isReturning) ? 1 : 0, y: hasSeenAnimation ? 0 : 20 }}
                    animate={{ opacity: activeSection || isReturning ? 0 : 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: fadeInDelay
                    }}
                    className="text-white hover:text-zinc-400 transition-colors inline-block hover:scale-125 hover:-translate-y-1 active:scale-90"
                    style={{ pointerEvents: typingDone ? "auto" : "none" }}
                  >
                    <Icon icon={link.icon} width="24" height="24" />
                  </motion.a>
                );
              })}
            </div>

            {/* Navigation tabs */}
            <motion.div
              className="flex items-center gap-8"
              style={{ pointerEvents: typingDone ? "auto" : "none" }}
            >
              {sections.map((section, index) => {
                const isReturningToThisButton = returningFrom === section.id;
                return (
                <motion.p
                  key={section.name}
                  layoutId={section.id}
                  onClick={() => handleSectionClick(section.id as Section)}
                  initial={{
                    opacity: isReturningToThisButton ? 1 : ((hasSeenAnimation && !isReturning) ? 1 : 0),
                    y: hasSeenAnimation ? 0 : 10
                  }}
                  animate={{
                    opacity: activeSection
                      ? (activeSection === section.id ? 1 : 0)  // Active button stays visible for morph, others fade immediately
                      : (returningFrom === section.id ? 0 : 1), // Keep selected button hidden during entire return
                    y: (activeSection === section.id) ? undefined : 0  // Don't animate y when morphing
                  }}
                  transition={{
                    opacity: {
                      delay: activeSection ? 0 : (isReturning ? NAV_TIMING.HOME_FADE_IN_DELAY / 1000 : (hasSeenAnimation ? 0 : (fullName.length + 1) * 0.1 + 0.3 + (socialLinks.length - 1) * 0.1 + 0.5 + index * 0.15)),
                      duration: 0.5
                    },
                    y: {
                      delay: hasSeenAnimation ? 0 : (fullName.length + 1) * 0.1 + 0.3 + (socialLinks.length - 1) * 0.1 + 0.5 + index * 0.15,
                      duration: 0.5
                    },
                    layout: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96], delay: activeSection ? 0.5 : 0 }
                  }}
                  whileHover={(activeSection === section.id) ? {} : { y: -2 }}
                  whileTap={{ scale: 1 }}
                  className="text-white text-lg hover:text-zinc-400 transition-colors cursor-pointer"
                  style={{
                    pointerEvents: (typingDone && !isAnimating) ? "auto" : "none",
                    visibility: (returningFrom === section.id || (activeSection === section.id && hideMorphedButton)) ? "hidden" : "visible"
                  }}
                >
                  {section.name}
                </motion.p>
                );
              })}
            </motion.div>

            {/* Spacer */}
            <div className="flex-1" />
          </motion.div>
        )}

        {showContent && (
          <AnimatePresence mode="wait">
            {activeSection && (
              <motion.div
                key={activeSection}
                initial={{
                  backgroundColor: isDirectReturn ? '#000000' : 'transparent'
                }}
                animate={{
                  backgroundColor: 'transparent'
                }}
                transition={{
                  backgroundColor: { duration: 0.3, delay: isDirectReturn ? 0 : 0 }
                }}
                className="absolute inset-0 w-full min-h-screen flex flex-col items-start pt-8 pl-8 pr-8 pb-16 overflow-y-auto"
              >
                {/* Back button - always render but make invisible for direct returns */}
                <motion.p
                  initial={{ opacity: isReturning ? 1 : 0 }}
                  animate={{ opacity: isExiting ? 0 : 1 }}
                  transition={{ duration: 0.3, delay: isExiting ? 0 : 1.5 }}
                  onClick={handleBack}
                  className="text-white text-sm hover:text-zinc-400 transition-colors mb-8 cursor-pointer"
                  style={{
                    visibility: isDirectReturn ? 'hidden' : 'visible',
                    pointerEvents: isDirectReturn ? 'none' : 'auto'
                  }}
                >
                  ← back
                </motion.p>

                {/* Section header with layoutId matching the nav button */}
                <motion.h1
                  layoutId={activeSection}
                  initial={{ opacity: isReturning ? 1 : undefined }}
                  exit={{ opacity: 1 }}
                  animate={{ opacity: isTransitioningToDetail ? 0 : 1 }}
                  transition={{
                    opacity: { duration: 0.3 },
                    layout: {
                      duration: 0.8,
                      ease: [0.43, 0.13, 0.23, 0.96],
                      delay: 0.5
                    }
                  }}
                  className="text-white text-5xl md:text-6xl font-light tracking-wide mb-12"
                >
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                </motion.h1>

                {/* Section content - don't render for direct returns (already faded on standalone) */}
                {!isDirectReturn && (
                  <motion.div
                    initial={{ opacity: isReturning ? 1 : 0 }}
                    animate={{ opacity: isExiting ? 0 : 1 }}
                    transition={{ duration: 0.3, delay: isExiting ? 0 : 1.5 }}
                    className="w-full"
                  >
                    <AnimatePresence mode="wait">
                      {activeSection === "projects" && (
                        <ProjectsView
                          key="projects"
                          isEmbedded={true}
                          skipReverseAnimation={isReturning}
                          onTransitionStart={() => setIsTransitioningToDetail(true)}
                        />
                      )}
                      {activeSection === "blog" && <BlogView key="blog" isEmbedded={true} skipReverseAnimation={isReturning} />}
                      {activeSection === "about" && <ResumeView key="about" />}
                      {activeSection === "work" && <NotesView key="work" />}
                      {activeSection === "shelf" && <ShelfView key="shelf" />}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}
