---
slug: workout-tracker
---

## The Problem

I had been tracking workouts in my Notes app since October 2023 - over 420 gym sessions with inconsistent formatting, varying weight notation, and zero ability to analyze progress or trends. The data was valuable but completely unusable.

## What We Built

### Phase 1: Data Pipeline
- **Custom parser** handling 10+ different exercise format variations
- **Data validation scanner** to identify edge cases before import
- **SQLite database** with normalized schema
- Successfully imported **421 workouts**, **2,305 exercise entries**, **94 unique exercises**

### Phase 2: TikTok Video
- **30-second animated video** using Remotion (React-based video framework)
- **GitHub-style heatmap calendar** showing workout consistency over 2 years
- **Animated weight progression chart** (210 lbs → 232.5 lbs)
- **Travel break highlights** with labeled red bars
- **TikTok-optimized layout** with proper safe zones

## Key Stats

- **Weight Journey:** 210 lbs → 232.5 lbs (+22.5 lbs gain)
- **Consistency:** 420 workouts over 751 days (56% workout rate)
- **Top Exercises:** Bench (154x), Squat (128x), Deadlift (103x)
- **Best Streak:** 9 consecutive gym days

## Technical Highlights

**Parser Intelligence:**
- Handled standard formats: `Bench - 190 5x8`
- Max weight notation: `Ab machine: max 4x20`
- Rep lists: `Pull-ups: 10, 8, 6, 5`
- Timed exercises: `Dead hang: 1min 16sec`
- Year rollover detection (2023 → 2024 → 2025)

**Video Animation:**
- Time-based X-axis showing real workout gaps
- Dynamic Y-axis preventing scale jumps
- First data point always visible (prevents layout shift)
- Staggered component animations with spring physics

## Demo

_[Demo video will be embedded here - TikTok video + before/after comparison]_

## Future Enhancements

- Automated monthly video generation
- Exercise-specific progression tracking (bench PRs, squat maxes)
- Web dashboard for exploring data
- Mobile app for logging new workouts
