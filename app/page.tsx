"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Github, Linkedin, Facebook } from "lucide-react";

export default function Home() {
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
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [hasVisitedSection, setHasVisitedSection] = useState(false);
  const fullName = "Alan See";

  useEffect(() => {
    // Pop in dots one by one
    const dotTimers = [0, 1, 2, 3, 4].map((index) =>
      setTimeout(() => {
        setVisibleDots(index + 1);
      }, index * 300) // 300ms between each dot
    );

    // After all dots appear, turn them dark
    const activateTimer = setTimeout(() => {
      setDotsActive(true);
    }, 1500); // All 5 dots appear by 1500ms

    // Key press down
    const keyPressTimer = setTimeout(() => {
      setKeyPress(true);
    }, 1800); // Press down after turning dark

    // Show confetti
    const confettiTimer = setTimeout(() => {
      setShowConfetti(true);
    }, 2050); // Confetti appears as key releases

    // Drop the dots
    const dropTimer = setTimeout(() => {
      setDropDots(true);
    }, 2300); // Drop after confetti

    // After dots drop, expand the line
    const expandTimer = setTimeout(() => {
      setExpandLine(true);
    }, 2800); // Dots finish dropping

    // After line expands, show content
    const contentTimer = setTimeout(() => {
      setShowLine(false);
      setShowContent(true);
    }, 4800); // Line expansion takes 2 seconds

    return () => {
      dotTimers.forEach(clearTimeout);
      clearTimeout(activateTimer);
      clearTimeout(keyPressTimer);
      clearTimeout(confettiTimer);
      clearTimeout(dropTimer);
      clearTimeout(expandTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  useEffect(() => {
    if (!showContent) return;

    // Typing effect for name
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullName.length) {
        setDisplayedName(fullName.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
        setTypingDone(true);
      }
    }, 100); // 100ms per character

    return () => clearInterval(typingInterval);
  }, [showContent]);

  const socialLinks = [
    { name: "TikTok", icon: "📱", href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/alan-see-880bb8140/" },
    { name: "X", icon: "𝕏", href: "https://twitter.com/seealanh" },
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Github", icon: Github, href: "https://github.com/alansee1" },
  ];

  const sections = ["Projects", "Blog", "Resume", "Notes", "Shelf"];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence>
        {showLine && (
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

      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-screen bg-black flex flex-col items-center justify-center gap-12"
        >
          {/* Spacer - top */}
          <div className="flex-1" />

          {/* Typing name */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{
              opacity: activeSection ? 0 : 1,
            }}
            transition={{ duration: 0.5 }}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: activeSection ? 0 : 1,
            }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-8 mb-6"
            style={{ pointerEvents: activeSection ? "none" : "auto" }}
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: fullName.length * 0.1 + 0.5 + index * 0.1,
                  duration: 0.5,
                }}
                whileHover={{ scale: 1.2, y: -4 }}
                whileTap={{ scale: 0.9 }}
                className="text-white hover:text-zinc-400 transition-colors"
              >
                {typeof link.icon === "string" ? (
                  <span className="text-2xl">{link.icon}</span>
                ) : (
                  <link.icon size={24} />
                )}
              </motion.a>
            ))}
          </motion.div>

          {/* Navigation tabs */}
          <motion.div
            className="flex items-center gap-8"
            style={{ pointerEvents: activeSection ? "none" : "auto" }}
          >
            {sections.map((section, index) => (
              <motion.button
                key={section}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: activeSection && section !== activeSection ? 0 : 1,
                  y: 0,
                }}
                transition={{
                  delay: !hasVisitedSection ? fullName.length * 0.1 + 1.5 + index * 0.15 : 0,
                  duration: 0.5,
                }}
                whileHover={!activeSection ? { y: -2 } : {}}
                onClick={() => {
                  setActiveSection(section);
                  setHasVisitedSection(true);
                }}
                className="text-white text-lg hover:text-zinc-400 transition-colors cursor-pointer"
              >
                {section}
              </motion.button>
            ))}
          </motion.div>

          {/* Spacer */}
          <div className="flex-1" />
        </motion.div>
      )}

      {/* Section View - Back Button and Content */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: activeSection ? 0.5 : 1.2 }}
            className="fixed inset-0 bg-black flex flex-col items-start pt-8 pl-8 z-40 pointer-events-none"
          >
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={() => setActiveSection(null)}
            className="text-white text-sm hover:text-zinc-400 transition-colors mb-8 pointer-events-auto"
          >
            ← back
          </motion.button>

          {/* Section Header */}
          <motion.h2
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-white text-5xl md:text-6xl font-light tracking-wide mb-12"
          >
            {activeSection}
          </motion.h2>

          {/* Section Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: activeSection ? 0.6 : 0 }}
            className="w-full max-w-4xl pointer-events-auto"
          >
            {activeSection === "Projects" && <ProjectsView />}
            {activeSection === "Blog" && <BlogView />}
            {activeSection === "Resume" && <ResumeView />}
            {activeSection === "Notes" && <NotesView />}
            {activeSection === "Shelf" && <ShelfView />}
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Placeholder Components
function ProjectsView() {
  const projects = [
    {
      title: "Personal Website",
      description: "A minimalist portfolio with cinematic entrance animation",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      year: "2025"
    },
    {
      title: "Cool Project #2",
      description: "Brief description of what this project does",
      tech: ["React", "Node.js", "MongoDB"],
      year: "2024"
    },
    {
      title: "Interesting Side Project",
      description: "Another awesome project you built",
      tech: ["Python", "FastAPI", "PostgreSQL"],
      year: "2024"
    },
  ];

  return (
    <div className="space-y-8">
      {projects.map((project, index) => (
        <motion.div
          key={project.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border-b border-zinc-800 pb-8"
        >
          <h3 className="text-2xl font-light text-white mb-2">{project.title}</h3>
          <p className="text-zinc-400 mb-3">{project.description}</p>
          <div className="flex gap-2 flex-wrap mb-3">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-1 bg-zinc-900 text-zinc-300 rounded"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="text-xs text-zinc-500">{project.year}</p>
        </motion.div>
      ))}
    </div>
  );
}

function BlogView() {
  const posts = [
    {
      title: "Building a Cinematic Web Animation",
      date: "Oct 21, 2025",
      excerpt: "Thoughts on creating delightful micro-interactions and entrance animations..."
    },
    {
      title: "The Art of Minimalism in Design",
      date: "Oct 15, 2025",
      excerpt: "Why less is often more when it comes to user interfaces..."
    },
    {
      title: "Getting Started with TypeScript",
      date: "Oct 10, 2025",
      excerpt: "A practical guide to adopting TypeScript in your projects..."
    },
  ];

  return (
    <div className="space-y-8">
      {posts.map((post, index) => (
        <motion.div
          key={post.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border-b border-zinc-800 pb-8 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <h3 className="text-xl font-light text-white mb-1">{post.title}</h3>
          <p className="text-xs text-zinc-500 mb-3">{post.date}</p>
          <p className="text-zinc-400">{post.excerpt}</p>
        </motion.div>
      ))}
    </div>
  );
}

function ResumeView() {
  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-xl font-light text-white mb-4">Experience</h3>
        <div className="space-y-6">
          <div className="border-l border-zinc-800 pl-4">
            <h4 className="text-white font-light">Senior Developer</h4>
            <p className="text-sm text-zinc-500">Amazing Company, 2023-2025</p>
            <p className="text-zinc-400 text-sm mt-2">Led development of key features and mentored junior developers.</p>
          </div>
          <div className="border-l border-zinc-800 pl-4">
            <h4 className="text-white font-light">Full Stack Developer</h4>
            <p className="text-sm text-zinc-500">Tech Startup, 2021-2023</p>
            <p className="text-zinc-400 text-sm mt-2">Built full-stack applications from concept to production.</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-light text-white mb-4">Skills</h3>
        <div className="flex gap-2 flex-wrap">
          {["TypeScript", "React", "Node.js", "Python", "Next.js", "Tailwind CSS", "PostgreSQL", "MongoDB"].map((skill) => (
            <span
              key={skill}
              className="text-sm px-3 py-1 bg-zinc-900 text-zinc-300 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotesView() {
  const notes = [
    { date: "Oct 22, 2025", content: "Today I learned about Framer Motion's layout animations - super powerful!" },
    { date: "Oct 20, 2025", content: "Finished the entrance animation. It took 6+ iterations to get right." },
    { date: "Oct 18, 2025", content: "Started building the personal website project. Minimalist black/white theme." },
  ];

  return (
    <div className="space-y-6">
      {notes.map((note, index) => (
        <motion.div
          key={note.date}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border-b border-zinc-800 pb-6"
        >
          <p className="text-xs text-zinc-500 mb-2">{note.date}</p>
          <p className="text-zinc-300">{note.content}</p>
        </motion.div>
      ))}
    </div>
  );
}

function ShelfView() {
  const items = [
    { title: "Atomic Habits", author: "James Clear", type: "Book", rating: 9 },
    { title: "Design Patterns", author: "Gang of Four", type: "Book", rating: 8 },
    { title: "The Pragmatic Programmer", author: "Hunt & Thomas", type: "Book", rating: 9 },
    { title: "Interface Design Principles", type: "Article", rating: 8 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border border-zinc-800 rounded p-4"
        >
          <p className="text-xs text-zinc-500 mb-1">{item.type}</p>
          <h4 className="text-lg font-light text-white mb-1">{item.title}</h4>
          {item.author && <p className="text-sm text-zinc-400 mb-3">{item.author}</p>}
          <div className="flex gap-1">
            {[...Array(item.rating)].map((_, i) => (
              <span key={i} className="text-yellow-500 text-sm">★</span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
