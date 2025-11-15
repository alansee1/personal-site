"use client";

import { useState, useMemo, useCallback } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../app/work-calendar.css";
import type { WorkItemWithProject, ProjectMetadata } from "@/lib/types";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: {
    workItem: WorkItemWithProject;
    projectColor: string;
  };
}

interface WorkCalendarProps {
  workItems: WorkItemWithProject[];
  projects: ProjectMetadata[];
}

// Generate consistent colors for projects
const generateProjectColor = (projectId: number): string => {
  const colors = [
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#f59e0b", // amber
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#f97316", // orange
    "#6366f1", // indigo
    "#14b8a6", // teal
    "#a855f7", // violet
  ];
  return colors[projectId % colors.length];
};

export default function WorkCalendar({ workItems, projects }: WorkCalendarProps) {
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);

  // Create project color map
  const projectColorMap = useMemo(() => {
    const map = new Map<number, string>();
    projects.forEach((project) => {
      map.set(project.id, generateProjectColor(project.id));
    });
    return map;
  }, [projects]);

  // Transform work items into calendar events (sorted by started_at)
  // Split cross-midnight events into two separate events
  const events = useMemo(() => {
    const eventList: CalendarEvent[] = [];

    workItems
      .filter((item) => item.started_at && item.completed_at)
      .filter((item) => selectedProjects.length === 0 || selectedProjects.includes(item.project_id))
      .forEach((item) => {
        const projectTitle = projects.find(p => p.id === item.project_id)?.title || 'Unknown';
        const start = new Date(item.started_at!);
        const end = new Date(item.completed_at!);

        // Check if event crosses midnight (different days)
        const crossesMidnight = start.toDateString() !== end.toDateString();

        if (crossesMidnight) {
          // Split into two events
          // Event 1: Start day from start time to 11:59:59 PM
          const endOfStartDay = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 23, 59, 59);
          eventList.push({
            id: item.id,
            title: `${projectTitle}`,
            start: start,
            end: endOfStartDay,
            resource: {
              workItem: item,
              projectColor: projectColorMap.get(item.project_id) || "#3b82f6",
            },
          });

          // Event 2: End day from 12:00:00 AM to end time
          const startOfEndDay = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 0, 0, 0);
          eventList.push({
            id: item.id + 10000, // Offset ID to avoid duplicates
            title: `${projectTitle}`,
            start: startOfEndDay,
            end: end,
            resource: {
              workItem: item,
              projectColor: projectColorMap.get(item.project_id) || "#3b82f6",
            },
          });
        } else {
          // Normal event within same day
          eventList.push({
            id: item.id,
            title: `${projectTitle}`,
            start: start,
            end: end,
            resource: {
              workItem: item,
              projectColor: projectColorMap.get(item.project_id) || "#3b82f6",
            },
          });
        }
      });

    return eventList.sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [workItems, projectColorMap, projects, selectedProjects]);

  // Calculate weekly total hours for the currently displayed week only
  const weeklyTotal = useMemo(() => {
    // Get the start and end of the current week being displayed
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const totalMinutes = events.reduce((acc, event) => {
      // Only count events that fall within the displayed week
      if (event.start >= weekStart && event.start < weekEnd) {
        const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60);
        return acc + duration;
      }
      return acc;
    }, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return { hours, minutes };
  }, [events, date]);

  // Toggle project filter
  const toggleProject = (projectId: number) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId));
    } else {
      setSelectedProjects([...selectedProjects, projectId]);
    }
  };

  // Find the earliest and latest work item dates
  const dateRange = useMemo(() => {
    if (workItems.length === 0) {
      return { earliest: new Date(), latest: new Date() };
    }
    const dates = workItems
      .filter(item => item.started_at)
      .map(item => new Date(item.started_at!));

    return {
      earliest: new Date(Math.min(...dates.map(d => d.getTime()))),
      latest: new Date(Math.max(...dates.map(d => d.getTime())))
    };
  }, [workItems]);

  // Check if we can navigate to previous/next week
  const canNavigate = useMemo(() => {
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const prevWeekStart = new Date(weekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);

    const nextWeekStart = new Date(weekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);

    return {
      prev: prevWeekStart >= startOfWeek(dateRange.earliest, { weekStartsOn: 0 }),
      next: nextWeekEnd <= new Date(dateRange.latest.getTime() + 7 * 24 * 60 * 60 * 1000)
    };
  }, [date, dateRange]);

  // Custom event style getter
  const eventStyleGetter = useCallback(
    (event: CalendarEvent) => {
      return {
        style: {
          backgroundColor: event.resource.projectColor,
          borderColor: event.resource.projectColor,
          color: "white",
          borderRadius: "4px",
          border: "none",
          fontSize: "0.75rem",
          padding: "2px 4px",
        },
      };
    },
    []
  );

  // Handle event click
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  // Handle navigation with restrictions
  const handleNavigate = useCallback((newDate: Date, view: View, action: 'PREV' | 'NEXT' | 'TODAY' | 'DATE') => {
    if (action === 'PREV' && !canNavigate.prev) {
      return;
    }
    if (action === 'NEXT' && !canNavigate.next) {
      return;
    }
    setDate(newDate);
  }, [canNavigate]);

  return (
    <div className="w-full space-y-4">
      {/* Project Legend and Weekly Total */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm text-zinc-500 font-medium">Projects:</span>
          {projects.map((project) => {
            const isSelected = selectedProjects.length === 0 || selectedProjects.includes(project.id);
            return (
              <button
                key={project.id}
                onClick={() => toggleProject(project.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all ${
                  isSelected
                    ? 'bg-zinc-800 border-zinc-700'
                    : 'bg-zinc-900 border-zinc-800 opacity-40'
                }`}
              >
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: projectColorMap.get(project.id) }}
                />
                <span className="text-sm text-zinc-300">{project.title}</span>
              </button>
            );
          })}
        </div>
        <div className="text-sm text-zinc-400">
          <span className="text-zinc-500">Weekly Total:</span>{' '}
          <span className="text-zinc-200 font-medium">
            {weeklyTotal.hours}h {weeklyTotal.minutes}m
          </span>
        </div>
      </div>

      {/* Calendar */}
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 work-calendar-container"
        data-can-nav-prev={canNavigate.prev}
        data-can-nav-next={canNavigate.next}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={handleNavigate}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          views={["week"]}
          defaultView="week"
          selectable
          step={30}
          timeslots={2}
          dayLayoutAlgorithm="no-overlap"
        />
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-medium text-zinc-100">
                {selectedEvent.resource.workItem.completed_summary ||
                  selectedEvent.resource.workItem.summary}
              </h3>
              <button
                onClick={closeModal}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-zinc-500">Project:</span>{" "}
                <span className="text-zinc-300">
                  {selectedEvent.resource.workItem.projects?.title || "-"}
                </span>
              </div>

              <div>
                <span className="text-zinc-500">Started:</span>{" "}
                <span className="text-zinc-300">
                  {format(selectedEvent.start, "PPp")}
                </span>
              </div>

              <div>
                <span className="text-zinc-500">Completed:</span>{" "}
                <span className="text-zinc-300">
                  {format(selectedEvent.end, "PPp")}
                </span>
              </div>

              <div>
                <span className="text-zinc-500">Duration:</span>{" "}
                <span className="text-zinc-300">
                  {Math.round(
                    (selectedEvent.end.getTime() - selectedEvent.start.getTime()) /
                      (1000 * 60)
                  )}{" "}
                  minutes
                </span>
              </div>

              {selectedEvent.resource.workItem.tags &&
                selectedEvent.resource.workItem.tags.length > 0 && (
                  <div>
                    <span className="text-zinc-500">Tags:</span>
                    <div className="flex gap-1.5 flex-wrap mt-1">
                      {selectedEvent.resource.workItem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded border border-zinc-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
