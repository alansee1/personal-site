"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import ProjectsView from "@/components/ProjectsView";
import BlogView from "@/components/BlogView";
import ResumeView from "@/components/ResumeView";
import NotesView from "@/components/NotesView";
import ShelfView from "@/components/ShelfView";

export default function Home() {
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
  type Section = "projects" | "blog" | "resume" | "notes" | "shelf";
  type SectionType = Section | null;
  const [activeSection, setActiveSection] = useState<SectionType>(null);

  // Mark component as mounted and check sessionStorage (runs first, prevents hydration mismatch)
  useEffect(() => {
    // Check sessionStorage and set animation state before mounting UI
    const animationSeen = sessionStorage.getItem('animationSeen');
    if (animationSeen) {
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

  // URL sync: Check initial URL on mount and set activeSection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const path = window.location.pathname;
    const sectionFromPath = path.slice(1) as SectionType; // Remove leading "/"

    if (sectionFromPath && ["projects", "blog", "resume", "notes", "shelf"].includes(sectionFromPath)) {
      setActiveSection(sectionFromPath);
    }
  }, []);

  // URL sync: Update URL when activeSection changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (activeSection) {
      window.history.pushState({}, '', `/${activeSection}`);
    } else {
      window.history.pushState({}, '', '/');
    }
  }, [activeSection]);

  // URL sync: Handle browser back/forward buttons
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const path = window.location.pathname;
      const sectionFromPath = path.slice(1) as SectionType;

      if (sectionFromPath && ["projects", "blog", "resume", "notes", "shelf"].includes(sectionFromPath)) {
        setActiveSection(sectionFromPath);
      } else {
        setActiveSection(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Section navigation handlers
  const handleSectionClick = (section: SectionType) => {
    setActiveSection(section);
  };

  const [returningFrom, setReturningFrom] = useState<SectionType>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  const handleBack = () => {
    setReturningFrom(activeSection);
    setIsExiting(true);
    setIsReturning(true);
    // Wait for content to fade out (0.3s), then trigger the morph
    setTimeout(() => {
      setActiveSection(null);
      setIsExiting(false);
      // Clear returning flag after homepage fully appears
      setTimeout(() => {
        setIsReturning(false);
        setReturningFrom(null);
      }, 2000);
    }, 300);
  };

  const socialLinks = [
    { name: "TikTok", icon: "fa6-brands:tiktok", href: "#" },
    { name: "LinkedIn", icon: "fa6-brands:linkedin", href: "https://www.linkedin.com/in/alan-see-880bb8140/" },
    { name: "X", icon: "fa6-brands:x-twitter", href: "https://twitter.com/seealanh" },
    { name: "Facebook", icon: "fa6-brands:facebook", href: "#" },
    { name: "GitHub", icon: "fa6-brands:github", href: "https://github.com/alansee1" },
  ];

  const sections = [
    { name: "Projects", id: "projects" as Section },
    { name: "Blog", id: "blog" as Section },
    { name: "Resume", id: "resume" as Section },
    { name: "Notes", id: "notes" as Section },
    { name: "Shelf", id: "shelf" as Section },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden">
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
              initial={{ opacity: hasSeenAnimation ? 1 : 0 }}
              animate={{ opacity: activeSection ? 0 : 1 }}
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
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: hasSeenAnimation ? 1 : 0, y: hasSeenAnimation ? 0 : 20 }}
                  animate={{ opacity: activeSection ? 0 : 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: activeSection ? 0 : (isReturning ? 1.4 : (hasSeenAnimation ? 0 : (fullName.length + 1) * 0.1 + 0.3 + index * 0.1))
                  }}
                  className="text-white hover:text-zinc-400 transition-colors inline-block hover:scale-125 hover:-translate-y-1 active:scale-90"
                  style={{ pointerEvents: typingDone ? "auto" : "none" }}
                >
                  <Icon icon={link.icon} width="24" height="24" />
                </motion.a>
              ))}
            </div>

            {/* Navigation tabs */}
            <motion.div
              className="flex items-center gap-8"
              style={{ pointerEvents: typingDone ? "auto" : "none" }}
            >
              {sections.map((section, index) => (
                <motion.p
                  key={section.name}
                  layoutId={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  initial={{ opacity: hasSeenAnimation ? 1 : 0, y: hasSeenAnimation ? 0 : 10 }}
                  animate={{
                    opacity: activeSection
                      ? (activeSection === section.id ? 1 : 0)
                      : 1,
                    y: 0
                  }}
                  transition={{
                    opacity: {
                      delay: activeSection ? 0 : (isReturning ? 1.4 : (hasSeenAnimation ? 0 : (fullName.length + 1) * 0.1 + 0.3 + (socialLinks.length - 1) * 0.1 + 0.5 + index * 0.15)),
                      duration: 0.5
                    },
                    y: {
                      delay: hasSeenAnimation || isReturning ? 0 : (fullName.length + 1) * 0.1 + 0.3 + (socialLinks.length - 1) * 0.1 + 0.5 + index * 0.15,
                      duration: 0.5
                    },
                    layout: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96], delay: activeSection ? 0.5 : 0 }
                  }}
                  whileHover={{ y: -2 }}
                  className="text-white text-lg hover:text-zinc-400 transition-colors cursor-pointer"
                  style={{
                    pointerEvents: typingDone ? "auto" : "none",
                    visibility: (isReturning && returningFrom === section.id) ? "hidden" : "visible"
                  }}
                >
                  {section.name}
                </motion.p>
              ))}
            </motion.div>

            {/* Spacer */}
            <div className="flex-1" />
          </motion.div>
        )}

        {showContent && (
          <AnimatePresence>
            {activeSection && (
              <motion.div
                key={activeSection}
                className="absolute inset-0 w-full min-h-screen bg-transparent flex flex-col items-start pt-8 pl-8 pr-8 pb-16 overflow-y-auto overflow-x-hidden"
              >
            {/* Back button */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: isExiting ? 0 : 1 }}
              transition={{ duration: 0.3, delay: isExiting ? 0 : 1.5 }}
              onClick={handleBack}
              className="text-white text-sm hover:text-zinc-400 transition-colors mb-8 cursor-pointer"
            >
              ← back
            </motion.p>

            {/* Section header with layoutId matching the nav button */}
            <motion.h1
              layoutId={activeSection}
              exit={{ opacity: 1 }}
              transition={{
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

            {/* Section content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isExiting ? 0 : 1 }}
              transition={{ duration: 0.3, delay: isExiting ? 0 : 1.5 }}
            >
              <AnimatePresence mode="wait">
                {activeSection === "projects" && <ProjectsView key="projects" />}
                {activeSection === "blog" && <BlogView key="blog" />}
                {activeSection === "resume" && <ResumeView key="resume" />}
                {activeSection === "notes" && <NotesView key="notes" />}
                {activeSection === "shelf" && <ShelfView key="shelf" />}
              </AnimatePresence>
            </motion.div>
          </motion.div>
            )}
          </AnimatePresence>
        )}
      </AnimatePresence>
    </div>
  );
}
