"use client";

export default function DatabasePreview() {
  const queryData = `sqlite> SELECT
  ec.name,
  COUNT(*) as sessions
FROM workout_exercises we
JOIN exercise_catalog ec
  ON we.exercise_id = ec.id
JOIN workouts w
  ON we.workout_id = w.id
WHERE ec.name = 'Bench'
  AND w.date LIKE '2024%'
GROUP BY ec.name;

name  | sessions
------|----------
Bench | 63`;

  return (
    <div className="flex flex-col items-center">
      <div className="w-[220px] h-[392px] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col font-mono text-[11px]">
        {/* Terminal header */}
        <div className="bg-zinc-900 px-3 py-2 border-b border-zinc-800 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-zinc-500 text-[9px] ml-1">workouts.db</span>
        </div>

        {/* Terminal content */}
        <div className="flex-1 overflow-y-auto p-3 bg-zinc-950">
          <pre className="text-green-400 whitespace-pre-wrap leading-relaxed">
            {queryData}
          </pre>
        </div>
      </div>
      <p className="mt-3 text-sm text-zinc-500 italic text-center">SQLite query results</p>
    </div>
  );
}
