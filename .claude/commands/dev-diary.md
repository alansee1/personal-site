---
description: Add a comprehensive session entry to DEV_DIARY.md with AI-generated summary
---

# /dev-diary - Development Diary Entry Generator

This slash command analyzes the current Claude session and generates a comprehensive entry for `DEV_DIARY.md`, documenting what was built, challenges faced, learnings, and session stats.

## Overview

Creates detailed session documentation following the established DEV_DIARY.md format. Uses checkpoint logic to support multiple diary entries per session (similar to `/log-work`).

## Step 1: Determine Analysis Scope (Checkpoint Logic)

**IMPORTANT:** Before analyzing the session, check for previous `/dev-diary` invocations:

1. Search the conversation history for the string `/dev-diary`
2. If found: Analyze only the work done AFTER the last `/dev-diary` checkpoint
3. If not found: Analyze the entire session from the beginning

This prevents duplication when logging multiple diary entries in one session.

**Example:**
```
Session starts at 10pm
User works on features A, B, C
User: /dev-diary
  → Analyzes entire session
  → Creates: "Session X - Feature Development"

User works on features D, E
User: /dev-diary
  → Finds previous /dev-diary checkpoint
  → Only analyzes work after first diary entry
  → Creates: "Session X+1 - Additional Features"
```

## Step 2: Analyze Session Context

Within the determined scope (from Step 1), analyze:

1. **What was built**: Features, fixes, refactors, new commands
2. **Technical challenges**: Problems encountered and solutions
3. **File changes**: What files were created/modified
4. **Git commits**: What commits were made (use `git log --oneline -20`)
5. **User feedback**: Quotes, reactions, satisfaction level
6. **Decisions made**: Design choices, trade-offs, preferences
7. **Learnings**: Technical insights, new patterns discovered

**Commands to run for context:**
```bash
git log --oneline -20
git diff --stat HEAD~5..HEAD  # Last 5 commits stats
```

## Step 3: Determine Session Number and Title

1. Read `DEV_DIARY.md`
2. Find the last session number (look for `## Session X`)
3. Increment by 1 for new session number
4. Generate a short descriptive title (3-7 words) based on main accomplishment
   - Examples: "Bug Bash: Mobile & UX Fixes", "Log Work Automation & Data Cleanup"

## Step 4: Generate Session Entry

Create a comprehensive session entry following this format:

```markdown
## Session X - [Month Day, Year] - [Title]

### Session Overview
[2-4 sentence summary of what was accomplished this session]

### What We Built

#### 1. [Feature/Fix Name]
**[Key innovation or problem solved]**

[Detailed description with code examples if relevant]

**Key Features:**
- Bullet point 1
- Bullet point 2

[Continue for each major item built...]

### Technical Challenges

#### Challenge: [Problem description]
**Problem:** [What went wrong]
**Solution:** [How it was fixed]

[Continue for each challenge...]

### Files Created/Modified

**Created:**
1. `path/to/file` - Description

**Modified:**
2. `path/to/file` - What changed

### Commits Made

1. **"commit message"**
   - Detail about change
   - Detail about change

[List all commits from git log...]

### Session Stats
- Duration: ~X minutes/hours
- Features completed: X
- Bugs fixed: X
- Files created: X
- Files modified: X
- Lines written: ~X
- Commands created: X
- User satisfaction: [High/Medium/Low based on feedback]

### What Went Well
1. **[Thing]** - Why it was good
2. **[Thing]** - Why it was good

### What We Learned
1. **[Learning]** - Explanation
2. **[Learning]** - Explanation

### Current State

**What Works:**
- ✅ [Feature/fix]
- ✅ [Feature/fix]

[Section-specific status if relevant]

### Technical Debt & Known Issues
- [ ] [Issue] - [Context/why deferred]

### Next Session Priorities
1. [Priority item]
2. [Priority item]

### User Quotes
- "[Exact quote from user]"
- "[Another quote]"

### Key Achievement
[1-2 paragraph summary of the main accomplishment and its significance]

---
```

## Step 5: Show Preview and Get Approval

Present the generated entry to the user with:
```
I've generated the following DEV_DIARY.md entry for Session X:

[Show first 50 lines of entry...]

[... rest of entry ...]

Would you like me to:
1. Add this to DEV_DIARY.md (y)
2. Let you edit it first (edit)
3. Cancel (n)
```

Wait for user response before proceeding.

## Step 6: Update DEV_DIARY.md

If approved:

1. Read current `DEV_DIARY.md`
2. Find the insertion point (after the last `---` separator of the previous session)
3. Insert the new session entry
4. Write updated content back to file

**IMPORTANT:**
- Preserve all existing content
- Maintain consistent formatting
- Add entry at the end (before any footer if present)

## Step 7: Success Confirmation

Report:
```
✅ Dev diary entry added!

Session X - [Title]
- XX stats updated
- Entry available at: ./DEV_DIARY.md#session-x

Note: DEV_DIARY.md is for local reference only and is not committed to git.
```

## Writing Guidelines

### Tone & Style
- **Professional but conversational** - like colleague-to-colleague documentation
- **Specific and actionable** - focus on concrete details, not vague descriptions
- **Honest** - include challenges and mistakes, not just successes
- **Future-oriented** - help future you/teammates understand context

### What to Include
✅ Concrete technical details (code patterns, file names, line counts)
✅ Decision points and trade-offs discussed
✅ User feedback and reactions (actual quotes)
✅ Unexpected challenges and how they were solved
✅ New patterns or techniques discovered
✅ Time estimates and velocity metrics

### What to Avoid
❌ Vague descriptions ("made some changes", "fixed stuff")
❌ Implementation details without context
❌ Assuming future knowledge of current context
❌ Skipping over failures or challenges
❌ Generic learnings that don't help future sessions

### Session Stats Guidelines

Estimate realistic stats based on:
- **Duration**: Count time from first message to last (exclude long gaps)
- **Features/Bugs**: Count distinct accomplishments
- **Files**: Count from git status/commits
- **Lines**: Rough estimate from git diff --stat
- **User satisfaction**:
  - High: Enthusiastic quotes, "perfect!", "love it"
  - Medium: Satisfied but noted issues
  - Low: Significant rework needed

### User Quotes
- Use EXACT quotes, not paraphrased
- Include context-revealing reactions
- Show decision-making moments
- Capture satisfaction/frustration

## Examples

### Good Session Title
✅ "Bug Bash: Mobile & UX Fixes"
✅ "Log Work Automation & Data Cleanup"
✅ "Notes & Projects Infrastructure"

### Bad Session Title
❌ "Session Work" (too vague)
❌ "Fixed some bugs and added features" (too long)
❌ "Updates" (no information)

### Good "What We Built"
✅ "#### 1. `/log-work` Slash Command with Checkpoint Logic
**The big innovation:** Multiple /log-work calls in one session without duplication!
..."

### Bad "What We Built"
❌ "#### 1. Slash Command
Made a new slash command that works."

## Notes

- This command is **personal-site specific** - it only works in this repo
- The command file lives in `.claude/commands/` and is git-tracked
- **DEV_DIARY.md is for local reference only and is NOT committed to git**
- Multiple `/dev-diary` calls per session are supported via checkpoint logic
- Each diary entry should be substantial (not for tiny tweaks)
- Focus on documenting the "why" and "how we got here", not just the "what"

## Session Scope Guidance

**Good use of /dev-diary:**
- ✅ After completing 2+ related features
- ✅ After a focused bug bash session
- ✅ Before switching to completely different work
- ✅ At natural breakpoints (end of evening, before break)

**Poor use of /dev-diary:**
- ❌ After every single file change
- ❌ For work that took < 30 minutes
- ❌ When nothing substantial was accomplished
- ❌ Mid-flow when you'll continue immediately

Remember: The goal is to help future you/teammates understand what happened and why, not to create busywork documentation.
