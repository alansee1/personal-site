"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";

// Types
interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  start: string;
  end: string | null;
  type: 'current' | 'past-job' | 'education' | 'pct';
  description: string;
  location?: string;
  shortTitle?: string; // Optional short name for narrow bars
  url?: string; // Optional link to company/organization website
}

interface BarDimensions {
  left: number;
  width: number;
}

interface BarData extends TimelineItem {
  dimensions: BarDimensions;
  row: number;
}

// Utility function to calculate duration between two dates
function calculateDuration(startDate: Date, endDate: Date | null = null): string {
  const end = endDate || new Date();
  const start = startDate;

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  const yearStr = years === 1 ? "1 yr" : years > 1 ? `${years} yrs` : "";
  const monthStr = months === 1 ? "1 mo" : months > 1 ? `${months} mos` : "";

  if (years > 0 && months > 0) {
    return `${yearStr} ${monthStr}`;
  } else if (years > 0) {
    return yearStr;
  } else if (months > 0) {
    return monthStr;
  } else {
    return "Less than 1 mo";
  }
}

// Format date range
function formatDateRange(start: string, end: string | null): string {
  // Parse YYYY-MM format properly
  const [startYear, startMonth] = start.split('-').map(Number);
  const startDate = new Date(startYear, startMonth - 1); // Month is 0-indexed

  let endDate: Date | null = null;
  if (end) {
    const [endYear, endMonth] = end.split('-').map(Number);
    endDate = new Date(endYear, endMonth - 1);
  }

  const startStr = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const endStr = endDate ? endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';

  return `${startStr} - ${endStr}`;
}

export default function ResumeView() {
  const [activeBar, setActiveBar] = useState<string | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Timeline data
  const timeline: TimelineItem[] = [
    {
      id: 'education',
      title: 'University of Wisconsin-La Crosse',
      subtitle: 'Bachelor of Science - Finance',
      start: '2015-08',
      end: '2018-12',
      type: 'education',
      description: 'Bachelor of Science (B.S.), Finance\nMinor in Information Systems',
      location: 'La Crosse, Wisconsin',
      url: 'https://www.uwlax.edu'
    },
    {
      id: 'xanterra',
      title: 'Xanterra Travel Collection',
      subtitle: 'Lead Sales Associate',
      start: '2016-05',
      end: '2016-09',
      type: 'past-job',
      description: 'Worked at the Old Faithful Inn gift shop and lived in employee housing within Yellowstone National Park.',
      location: 'Yellowstone National Park',
      shortTitle: 'XTC',
      url: 'https://www.xanterra.com'
    },
    {
      id: 'ace',
      title: 'ACE Hardware Retail Support Center',
      subtitle: 'Material Handler',
      start: '2016-10',
      end: '2019-04',
      type: 'past-job',
      description: 'Managed warehouse operations and inventory for retail distribution center.',
      location: 'La Crosse, Wisconsin'
    },
    {
      id: 'lhi',
      title: 'Logistics Health Incorporated',
      subtitle: 'Business Analyst Intern',
      start: '2017-06',
      end: '2018-04',
      type: 'past-job',
      description: 'Analyzed business processes and supported operational tasks. Found AutoHotKey at this internship and thought it was awesome. Got introduced to how SQL is used in a professional environment.',
      location: 'La Crosse, Wisconsin',
      shortTitle: 'LHI',
      url: 'https://lhi.care/aboutoptumserve'
    },
    {
      id: 'sap',
      title: 'SAP',
      subtitle: 'Product Support Engineer, Intern',
      start: '2018-04',
      end: '2019-04',
      type: 'past-job',
      description: 'Supported enterprise customers with technical product issues.',
      location: 'La Crosse, Wisconsin',
      url: 'https://www.sap.com/index.html'
    },
    {
      id: 'pct',
      title: '⛰️ Pacific Crest Trail Hike',
      subtitle: '~2,100 miles from Mexico to end of Oregon',
      start: '2019-05',
      end: '2019-10',
      type: 'pct',
      description: 'Thru-hiked about 2,100 miles from the Mexican border through California and Oregon. Was basically a homeless person.',
      location: 'California, Oregon',
      shortTitle: 'PCT',
      url: 'https://en.wikipedia.org/wiki/Pacific_Crest_Trail'
    },
    {
      id: 'lively1',
      title: 'Lively, Inc.',
      subtitle: 'Member Support Associate',
      start: '2019-10',
      end: '2021-03',
      type: 'past-job',
      description: 'Helped account holders navigate their health benefit accounts, troubleshooting issues and answering questions.',
      location: 'San Francisco, California',
      url: 'https://livelyme.com'
    },
    {
      id: 'lively2',
      title: 'Lively, Inc.',
      subtitle: 'Application Support Engineer',
      start: '2021-03',
      end: '2022-08',
      type: 'past-job',
      description: 'Provided triage for the platform and bridged the gap between customer issues and engineering. Handled operational tasks manually, fixed bugs, and spent a ton of time with SQL and in a database.',
      location: 'Remote',
      url: 'https://livelyme.com'
    },
    {
      id: 'lively3',
      title: 'Lively, Inc.',
      subtitle: 'Senior Application Support Engineer',
      start: '2022-08',
      end: null,
      type: 'current',
      description: 'Leading triage efforts for platform issues, bridging the gap between customer needs and engineering solutions. Mentoring team members, fixing bugs, handling operational tasks, and spending plenty of time with SQL and databases.',
      location: 'Remote',
      url: 'https://livelyme.com'
    }
  ];

  // Timeline span - dynamically extends to current year
  const timelineStart = new Date('2015-01-01');
  const currentYear = new Date().getFullYear();
  const timelineEnd = new Date(`${currentYear}-12-31`);
  const totalDuration = timelineEnd.getTime() - timelineStart.getTime();

  // Calculate bar dimensions (flipped: newest on left, oldest on right)
  const calculateBarDimensions = (start: string, end: string | null): BarDimensions => {
    const startDate = new Date(start);
    // Use timeline end for current jobs to extend to end of current year
    const endDate = end ? new Date(end) : timelineEnd;

    const widthPercent = ((endDate.getTime() - startDate.getTime()) / totalDuration) * 100;
    // Flip the timeline: 100 - position of END date gives us left edge in reversed timeline
    const leftPercent = 100 - ((endDate.getTime() - timelineStart.getTime()) / totalDuration) * 100;

    return { left: leftPercent, width: widthPercent };
  };

  // Calculate vertical position (stacking)
  const calculateVerticalPosition = (bars: BarData[], newBar: BarData): number => {
    const { left, width } = newBar.dimensions;
    const right = left + width;

    let row = 0;
    let collision = true;

    while (collision) {
      collision = false;
      for (let bar of bars) {
        if (bar.row === row) {
          const barRight = bar.dimensions.left + bar.dimensions.width;
          if (!(right < bar.dimensions.left || left > barRight)) {
            collision = true;
            break;
          }
        }
      }
      if (collision) row++;
    }

    return row;
  };

  // Process timeline data - MEMOIZED to prevent recalculation
  const bars = useMemo(() => {
    const processedBars: BarData[] = [];
    timeline.forEach((item) => {
      const dimensions = calculateBarDimensions(item.start, item.end);
      const barData: BarData = { ...item, dimensions, row: 0 };
      barData.row = calculateVerticalPosition(processedBars, barData);

      // Manually move current job down one row
      if (item.id === 'lively3') {
        barData.row = 1;
      }

      processedBars.push(barData);
    });
    return processedBars;
  }, []); // Empty dependency array - calculate once on mount

  const ganttHeight = useMemo(() => {
    if (!bars || bars.length === 0) return 100; // Default height
    const maxRow = Math.max(...bars.map(b => b.row));
    return (maxRow + 1) * 44 + 20;
  }, [bars]);

  // Get bar style classes
  const getBarClassName = (type: string, isActive: boolean) => {
    const baseClass = "absolute h-8 rounded cursor-pointer flex items-center justify-center px-3 text-sm font-light overflow-hidden whitespace-nowrap transition-all duration-300";
    const typeClass = {
      'current': 'bg-white text-black',
      'past-job': 'bg-zinc-600 text-white',
      'education': 'bg-rose-900 text-zinc-300',
      'pct': 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-normal'
    }[type] || 'bg-zinc-600';

    return `${baseClass} ${typeClass} ${isActive ? 'brightness-125 shadow-lg shadow-white/20' : 'hover:-translate-y-0.5 hover:brightness-110'}`;
  };

  const activeItem = bars.find(b => b.id === activeBar);

  const handleBarClick = (id: string) => {
    setActiveBar(activeBar === id ? null : id);
  };

  const handleTimelineScroll = () => {
    setShowSwipeHint(false);
  };

  // Auto-scroll to details panel on mobile when a bar is clicked
  useEffect(() => {
    if (activeBar && detailsRef.current) {
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [activeBar]);

  return (
    <div className="w-screen -ml-8 px-4 md:px-24">
      {/* Legend */}
      <div className="flex gap-6 pb-6 mb-6 border-b border-zinc-800 flex-wrap justify-center">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-white"></div>
          <span className="text-sm text-zinc-400">Current Role</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-zinc-600"></div>
          <span className="text-sm text-zinc-400">Past Jobs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-rose-900"></div>
          <span className="text-sm text-zinc-400">Education</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-teal-500 to-cyan-500"></div>
          <span className="text-sm text-zinc-400">Life</span>
        </div>
      </div>

      {/* Timeline container - scrollable on mobile */}
      <div className="overflow-x-auto md:overflow-x-visible relative" onScroll={handleTimelineScroll}>
        {/* Scroll hint - bottom center, mobile only */}
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 text-zinc-400 text-sm md:hidden pointer-events-none pb-2 transition-opacity duration-200 ${showSwipeHint ? 'opacity-100' : 'opacity-0'}`}>
          ← Swipe →
        </div>

        <div className="min-w-[1000px] md:min-w-0 scale-90 md:scale-100 origin-left">
          {/* Year Labels */}
          <div className="flex justify-between mb-5">
            {Array.from({ length: currentYear - 2015 + 1 }, (_, i) => currentYear - i).map((year) => (
              <span key={year} className="text-zinc-500 text-xs font-light">
                {year}
              </span>
            ))}
          </div>

          {/* Timeline Base Line */}
          <div className="h-0.5 bg-zinc-800 mb-10" />

          {/* Gantt Chart */}
          <div className="relative" style={{ height: `${ganttHeight}px` }}>
            {bars && bars.map((bar) => (
              <div
                key={bar.id}
                className={getBarClassName(bar.type, activeBar === bar.id)}
                style={{
                  left: `${bar.dimensions.left}%`,
                  width: `${bar.dimensions.width}%`,
                  top: `${bar.row * 44}px`,
                  fontSize: bar.shortTitle !== undefined ? '0.75rem' : undefined
                }}
                onClick={() => handleBarClick(bar.id)}
              >
                {bar.shortTitle !== undefined ? bar.shortTitle : bar.title}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details Panel */}
      <div ref={detailsRef} className="mt-2 relative">
        <AnimatePresence mode="wait">
          {activeItem ? (
            <motion.div
              key="details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 h-[240px]"
            >
              {activeItem.url ? (
                <a
                  href={activeItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-2xl font-normal mb-2 block hover:text-zinc-300 transition-colors underline-offset-4 hover:underline"
                >
                  <h3>{activeItem.title}</h3>
                </a>
              ) : (
                <h3 className="text-white text-2xl font-normal mb-2">{activeItem.title}</h3>
              )}
              <h4 className="text-zinc-400 text-lg font-light mb-4">{activeItem.subtitle}</h4>
              <div className="text-zinc-500 text-sm mb-2">
                {formatDateRange(activeItem.start, activeItem.end)} ·{' '}
                {calculateDuration(new Date(activeItem.start), activeItem.end ? new Date(activeItem.end) : null)}
              </div>
              {activeItem.location && (
                <div className="text-zinc-500 text-sm mb-4">{activeItem.location}</div>
              )}
              <div className="text-zinc-300 text-base italic leading-relaxed">
                {activeItem.description}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-dashed border-zinc-700 rounded-lg p-8 flex items-center justify-center h-[240px]"
            >
              <p className="text-zinc-500 text-center">Click a bar to view details</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
