---
slug: workout-tracker
---

[component:WorkoutTLDR]

[component:WhatWeBuiltHeader]

### Phase 1: Data Pipeline

Two years of gym notes, zero consistency. Some days I'd write `Bench - 190 5x8`, other days `Bench: 5x8 190` with the order flipped. Pull-ups were just a list of reps: `10, 8, 6, 5`. Timed exercises like `Dead hang: 1min 16sec`. And I never once wrote the year - the parser had to figure out when October rolled into the next year.

The parser I built handles 10+ format variations using sequential regex matching, testing each line from most specific patterns to least specific. It tracks context too - when it sees a line like just `185 5x5`, it knows that's a pyramid set for whatever exercise came before it.

After scanning 3,112 lines of raw text, I got everything into a normalized SQLite schema with three tables: `workouts` (daily sessions), `exercise_catalog` (94 unique exercises), and `workout_exercises` (the actual lifts with weight, sets, reps, and whether I failed). Final count: **421 workouts** and **2,305 exercise entries**.

### Phase 2: Progress Visualization

With clean data, I used Remotion to generate a 30-second TikTok-style video (1080x1920, 30fps). The whole thing is built in React with pure SVG - no charting libraries.

The trickiest part was the animated weight chart. I wanted the line to reveal progressively over 19 seconds, but two bugs kept breaking it: the Y-axis would jump around as new data points appeared (fixed by calculating scale from the full dataset upfront), and the layout would shift at frame 60 (fixed by always rendering at least one data point).

I also built a GitHub-style heatmap for workout consistency, stat cards showing streaks and totals, and semi-transparent red bars highlighting my travel breaks (Asia, Europe twice, Minnesota). The whole layout accounts for TikTok's UI with 12% top and 10% bottom safe zones.

