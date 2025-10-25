"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

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

  // Timeline data
  const timeline: TimelineItem[] = [
    {
      id: 'education',
      title: 'University of Wisconsin-La Crosse',
      subtitle: 'Bachelor of Science - Finance',
      start: '2015-08',
      end: '2018-12',
      type: 'education',
      description: 'Studied Finance while working multiple jobs to support education',
      location: 'La Crosse, Wisconsin'
    },
    {
      id: 'xanterra',
      title: 'Xanterra Travel Collection',
      subtitle: 'Lead Sales Associate',
      start: '2016-05',
      end: '2016-09',
      type: 'past-job',
      description: 'Leading retail operations in Yellowstone National Park',
      location: 'Yellowstone National Park'
    },
    {
      id: 'ace',
      title: 'ACE Hardware Retail Support Center',
      subtitle: 'Material Handler',
      start: '2016-10',
      end: '2019-04',
      type: 'past-job',
      description: 'Warehouse operations and inventory management (concurrent with studies and internships)',
      location: 'La Crosse, Wisconsin'
    },
    {
      id: 'lhi',
      title: 'Logistics Health Incorporated',
      subtitle: 'Business Analyst Intern',
      start: '2017-06',
      end: '2018-04',
      type: 'past-job',
      description: 'Analyzing business processes and supporting data-driven decision making',
      location: 'La Crosse-Onalaska Area'
    },
    {
      id: 'sap',
      title: 'SAP',
      subtitle: 'Product Support Engineer, Intern',
      start: '2018-04',
      end: '2019-04',
      type: 'past-job',
      description: 'Supporting enterprise customers with technical product issues',
      location: 'La Crosse, Wisconsin'
    },
    {
      id: 'pct',
      title: '⛰️ Pacific Crest Trail Hike',
      subtitle: '~2,100 miles from Mexico to end of Oregon',
      start: '2019-05',
      end: '2019-10',
      type: 'pct',
      description: 'Hiked approximately 2,100 miles of the Pacific Crest Trail, from the Mexican border through California and Oregon. An incredible journey of self-discovery and endurance.',
      location: 'California, Oregon'
    },
    {
      id: 'lively1',
      title: 'Lively, Inc.',
      subtitle: 'Member Support Associate',
      start: '2019-10',
      end: '2021-03',
      type: 'past-job',
      description: 'Supporting members with HSA and FSA account questions and troubleshooting',
      location: 'San Francisco, California'
    },
    {
      id: 'lively2',
      title: 'Lively, Inc.',
      subtitle: 'Application Support Engineer',
      start: '2021-03',
      end: '2022-08',
      type: 'past-job',
      description: 'Providing technical support for HSA/FSA platform and benefits administration',
      location: 'San Francisco, California'
    },
    {
      id: 'lively3',
      title: 'Lively, Inc.',
      subtitle: 'Senior Application Support Engineer',
      start: '2022-08',
      end: null,
      type: 'current',
      description: 'Leading technical support operations and mentoring team members',
      location: 'San Francisco, California'
    }
  ];

  // Timeline span
  const timelineStart = new Date('2015-01-01');
  const timelineEnd = new Date('2025-12-31');
  const totalDuration = timelineEnd.getTime() - timelineStart.getTime();

  // Calculate bar dimensions
  const calculateBarDimensions = (start: string, end: string | null): BarDimensions => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();

    const leftPercent = ((startDate.getTime() - timelineStart.getTime()) / totalDuration) * 100;
    const widthPercent = ((endDate.getTime() - startDate.getTime()) / totalDuration) * 100;

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
      processedBars.push(barData);
    });
    return processedBars;
  }, []); // Empty dependency array - only calculate once

  const ganttHeight = useMemo(() => {
    const maxRow = Math.max(...bars.map(b => b.row));
    return (maxRow + 1) * 44 + 20;
  }, [bars]);

  // Get bar style classes
  const getBarClassName = (type: string, isActive: boolean) => {
    const baseClass = "absolute h-8 rounded cursor-pointer flex items-center px-3 text-sm font-light overflow-hidden whitespace-nowrap transition-all duration-300";
    const typeClass = {
      'current': 'bg-white text-black',
      'past-job': 'bg-zinc-600 text-white',
      'education': 'bg-zinc-700 text-zinc-300',
      'pct': 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-normal'
    }[type] || 'bg-zinc-600';

    return `${baseClass} ${typeClass} ${isActive ? 'brightness-125 shadow-lg shadow-white/20' : 'hover:-translate-y-0.5 hover:brightness-110'}`;
  };

  const activeItem = bars.find(b => b.id === activeBar);

  const handleBarClick = (id: string) => {
    setActiveBar(activeBar === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        opacity: { delay: 1.5, duration: 0.3 }
      }}
      className="w-full max-w-6xl"
    >
      <div>
        {/* Experience Timeline */}
        <div>
          <h3 className="text-xl font-light text-white mb-8">Experience Timeline</h3>

          {/* Legend */}
          <div className="flex gap-6 pb-6 mb-6 border-b border-zinc-800 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-white"></div>
              <span className="text-sm text-zinc-400">Current Role</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-zinc-600"></div>
              <span className="text-sm text-zinc-400">Past Jobs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-zinc-700"></div>
              <span className="text-sm text-zinc-400">Education</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-teal-500 to-cyan-500"></div>
              <span className="text-sm text-zinc-400">Life Milestones</span>
            </div>
          </div>

          {/* Year Labels */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-between mb-5 px-2"
          >
            {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map((year, i) => (
              <span key={year} className="text-zinc-500 text-xs font-light">
                {year}
              </span>
            ))}
          </motion.div>

          {/* Timeline Base Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="h-0.5 bg-zinc-800 mb-10 origin-left"
          />

          {/* Gantt Chart */}
          <div className="relative mb-10" style={{ height: `${ganttHeight}px` }}>
            {bars.map((bar, index) => (
              <motion.div
                key={bar.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.8,
                  duration: 0.5
                }}
                className={getBarClassName(bar.type, activeBar === bar.id)}
                style={{
                  left: `${bar.dimensions.left}%`,
                  width: `${bar.dimensions.width}%`,
                  top: `${bar.row * 44}px`
                }}
                onClick={() => handleBarClick(bar.id)}
              >
                {bar.title}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Details Panel - FIXED HEIGHT CONTAINER */}
        <div className="relative" style={{ height: '300px', marginTop: '40px' }}>
          <motion.div
            initial={false}
            animate={{
              opacity: activeItem ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 overflow-auto h-full"
            style={{ visibility: activeItem ? 'visible' : 'hidden' }}
          >
            {activeItem && (
              <div>
                <h3 className="text-white text-2xl font-normal mb-2">{activeItem.title}</h3>
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
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
