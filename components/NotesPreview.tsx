"use client";

export default function NotesPreview() {
  const notesData = `10/1
  –  weight: 210
  –  CGBP - 160 5x12
10/4
  –  weight: 207.9
  –  Bench - 190 5x8
  –  Leg Press - 295 5x12
10/5
  –  Weight: 208
  –  narrow grip lat pull down - 135 5x5
10/6
  –  Weight: 206.8
  –  squat - 190 5x5
  –  Barbell shrug 190 5x6
10/7
  –  weight: 206.6
  –  Narrow grip lat pull down - 140 5x5
  –  Bench: 195 5x6
  –  Machine pec fly: 4x12 115
10/8
  –  weight: 206.2
  –  Shoulder press: 95 5x5
10/9
  –  weight: 207.8
  –  Squat: 195 5x5
  –  Bench: 200 5x5
  –  Machine pec fly: 4x12 120
  –  Barbell Shrug: 195 5x6
10/15
  –  weight: 210.5
  –  Shoulder press 100 5x5
  –  Leg press 300 5x12
  –  Narrow grip lat pull down 145 5x5
10/16
  –  weight:209
  –  Bench: 205 5x5
  –  Barbell Shrug: 200 5x6
  –  EZ barbell curl: 75 3x12
  –  Rope push down: 47.5 4x12
  –  Machine pec fly: 4x12 125
10/17
  –  weight: 208.3
  –  Squat: 200 5x5
  –  Narrow grip lat pull down 154 5x5
  –  Seated leg curl: 100 3x12
  –  Leg extension: 95 3x12
  –  Upright supinated row: 85 3x12
10/22
  –  weight: 210.3
  –  Bench: 210 5x4
  –  Narrow grip lat pull down 160 5x5`;

  return (
    <div className="my-8 flex flex-col items-center">
      <div className="w-[220px] h-[392px] rounded-3xl overflow-hidden border border-zinc-800 bg-black shadow-2xl flex flex-col">
      {/* iOS-style header */}
      <div className="bg-black px-4 pt-3 pb-2 border-b border-zinc-800">
        {/* Top row with back and icons */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-amber-500 text-sm font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Notes
          </span>
          <div className="flex items-center gap-4 text-amber-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="6" r="1.5" />
              <circle cx="12" cy="18" r="1.5" />
            </svg>
          </div>
        </div>
        {/* Date */}
        <p className="text-zinc-500 text-xs text-center">December 9, 2025 at 11:18 PM</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-black">
        <h2 className="text-2xl font-bold text-white mb-4">Workout</h2>
        <pre className="text-sm text-white font-sans whitespace-pre-wrap leading-relaxed">
          {notesData}
        </pre>
      </div>

      {/* iOS-style bottom toolbar */}
      <div className="bg-black px-6 py-3 border-t border-zinc-800 flex items-center justify-between">
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>
      </div>
      <p className="mt-3 text-sm text-zinc-500 italic text-center">Sample of raw workout data from Notes app</p>
    </div>
  );
}
