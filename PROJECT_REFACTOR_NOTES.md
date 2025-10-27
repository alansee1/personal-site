# Project System Refactor - Remaining Work

## Context: What We Just Built

We migrated from a JSON-only projects system to a **hybrid DB + Markdown** approach:

**Architecture:**
```
Supabase DB (metadata)         Markdown Files (long content)
├── title                      ├── content/projects/workout-tracker.md
├── slug                       ├── content/projects/personal-site.md
├── description                └── content/projects/ai-art.md
├── status (active/paused)
├── tech[] (array)
├── github (url)
├── url (live site)
├── start_date / end_date
└── media[] (future)
```

**Why Hybrid?**
- DB: Queryable metadata, real-time updates, filtering/sorting
- Markdown: Version controlled, easy to edit, great SEO via SSR
- Linked by: `slug` field

**What Works:**
- ✅ Projects page fetches from `/api/projects` (DB)
- ✅ Project detail pages: SSR with `generateMetadata()` for SEO
- ✅ Markdown rendering with syntax highlighting (matches blog)
- ✅ Collapsible Work Log with count badge
- ✅ All 3 projects migrated (workout-tracker, personal-site, ai-art)

## Remaining Tasks

### 1. /project-health Script

**Purpose:** Validation script to ensure DB and filesystem stay in sync.

**What it should check:**
1. Every project in DB has a matching markdown file
2. Every markdown file has a matching DB record
3. Slugs match between DB and filenames
4. No orphaned records

**Suggested location:** `/scripts/project-health.js`

**Example implementation:**
```javascript
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkProjectHealth() {
  console.log('🔍 Running project health check...\n');

  // 1. Get all DB projects
  const { data: dbProjects, error } = await supabase
    .from('projects')
    .select('id, slug, title')
    .order('id');

  if (error) {
    console.error('❌ Failed to fetch projects from DB:', error.message);
    process.exit(1);
  }

  console.log(`📊 Found ${dbProjects.length} projects in database`);

  // 2. Get all markdown files
  const contentDir = path.join(process.cwd(), 'content', 'projects');
  const files = fs.readdirSync(contentDir)
    .filter(f => f.endsWith('.md') && f !== '.gitkeep');

  const mdSlugs = files.map(f => f.replace('.md', ''));
  console.log(`📄 Found ${files.length} markdown files\n`);

  // 3. Check DB → Markdown
  console.log('Checking DB records have markdown files:');
  let orphanedDb = [];
  for (const project of dbProjects) {
    const hasFile = fs.existsSync(path.join(contentDir, `${project.slug}.md`));
    if (!hasFile) {
      console.log(`  ❌ ${project.slug} (ID: ${project.id}) - MISSING FILE`);
      orphanedDb.push(project);
    } else {
      console.log(`  ✅ ${project.slug}`);
    }
  }

  // 4. Check Markdown → DB
  console.log('\nChecking markdown files have DB records:');
  let orphanedMd = [];
  for (const slug of mdSlugs) {
    const hasDb = dbProjects.some(p => p.slug === slug);
    if (!hasDb) {
      console.log(`  ❌ ${slug}.md - MISSING DB RECORD`);
      orphanedMd.push(slug);
    } else {
      console.log(`  ✅ ${slug}.md`);
    }
  }

  // 5. Summary
  console.log('\n' + '='.repeat(50));
  if (orphanedDb.length === 0 && orphanedMd.length === 0) {
    console.log('✅ All projects healthy! DB and filesystem in sync.');
    process.exit(0);
  } else {
    console.log('⚠️  Issues found:');
    if (orphanedDb.length > 0) {
      console.log(`  - ${orphanedDb.length} DB records without markdown files`);
    }
    if (orphanedMd.length > 0) {
      console.log(`  - ${orphanedMd.length} markdown files without DB records`);
    }
    process.exit(1);
  }
}

checkProjectHealth();
```

**Add to package.json:**
```json
"scripts": {
  "project:health": "node scripts/project-health.js"
}
```

**Integration with build:**
```json
"build": "node scripts/project-health.js && node scripts/generate-blog-data.js && next build"
```

---

### 2. /update-project Command

**Purpose:** Update existing project metadata + markdown content.

**Location:** `.claude/commands/update-project.md`

**User flow:**
1. Ask which project to update (show list from DB)
2. Show current values
3. Ask what to change (title, description, status, tech, github, url, markdown)
4. Update DB if metadata changed
5. Update markdown file if content changed
6. Git commit + push (optional)

**Key features:**
- Interactive field selection (don't ask for everything)
- Show before/after diff
- Atomic updates (rollback if either fails)
- Markdown editor support (open in $EDITOR?)

**Example structure:**
```markdown
# Update Project Command

Step 1: List projects and ask user to select one
- Fetch from Supabase
- Show: ID, slug, title, status

Step 2: Show current values
```
Current project: workout-tracker
Title: Workout Tracker
Description: Full workout tracking system...
Status: paused
Tech: Node.js, SQLite, Remotion, React, TypeScript, Tailwind CSS, dayjs
GitHub: null
URL: null
```

Step 3: Ask what to update
- Checkboxes: [ ] Title, [ ] Description, [ ] Status, [ ] Tech, [ ] Links, [ ] Markdown content

Step 4: Update DB fields (if selected)
```javascript
const updates = {};
if (titleChanged) updates.title = newTitle;
if (descChanged) updates.description = newDesc;
// etc...

const { error } = await supabase
  .from('projects')
  .update(updates)
  .eq('id', projectId);
```

Step 5: Update markdown (if selected)
- Read current markdown
- Ask for changes (full rewrite? append section?)
- Write back to file

Step 6: Git operations
- `git add content/projects/${slug}.md`
- `git commit -m "Update ${title} project"`
- `git push` (optional)
```

---

### 3. Refactor /create-project Command

**Current state:** **BROKEN** - still writes to `data/projects.json` which doesn't exist!

**Location:** `.claude/commands/create-project.md`

**What needs changing:**

**OLD FLOW (broken):**
1. Gather info from user
2. Generate slug from title
3. Write to `data/projects.json`
4. Git commit + push
5. Wait for Vercel deploy

**NEW FLOW (hybrid):**
1. Gather info from user
   - Title
   - Description
   - Tech stack (comma-separated)
   - Status (default: active)
   - GitHub URL (optional)
   - Live URL (optional)
   - Start date (default: today)

2. Generate slug from title
   - Lowercase, replace spaces with hyphens
   - Check for collisions in DB

3. **Insert into Supabase**
   ```javascript
   const { data, error } = await supabase
     .from('projects')
     .insert({
       slug: generatedSlug,
       title: userTitle,
       description: userDescription,
       status: userStatus || 'active',
       tech: techArray,
       github: githubUrl || null,
       url: liveUrl || null,
       start_date: startDate || new Date().toISOString().split('T')[0]
     })
     .select()
     .single();
   ```

4. **Create markdown file**
   ```javascript
   const markdownTemplate = `---
slug: ${slug}
---

## Overview

${description}

## Key Features

- Feature 1
- Feature 2

## What We Built

_[Add detailed description here]_

## Future Enhancements

- Enhancement 1
- Enhancement 2
`;

   fs.writeFileSync(
     path.join(process.cwd(), 'content', 'projects', `${slug}.md`),
     markdownTemplate
   );
   ```

5. **Git operations**
   ```bash
   git add content/projects/${slug}.md
   git commit -m "Add ${title} project"
   git push
   ```

6. **Verify health**
   - Run project-health check
   - Confirm DB + file created

**Error handling:**
- If DB insert fails → don't create file
- If file creation fails → delete DB record (rollback)
- If git fails → warn user but keep changes

**Key differences from old command:**
- NO JSON file operations
- DB writes use SUPABASE_SERVICE_ROLE_KEY (from .env.local)
- Markdown file created at same time
- Atomic operations (both succeed or both fail)

---

## Important Notes

### Environment Variables

**Local (.env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx (public, safe)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx (secret, write access)
```

**Vercel (production):**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx (public)
```
⚠️ **DO NOT** add SUPABASE_SERVICE_ROLE_KEY to Vercel!

### Slug is the Source of Truth

Both DB and filesystem use `slug` as the linking field:
- DB: `projects.slug` (unique index)
- Filesystem: `content/projects/{slug}.md`
- URLs: `/projects/{slug}`

### Markdown Frontmatter

Must include `slug` in frontmatter:
```markdown
---
slug: workout-tracker
---
```

This is used for validation in health checks.

### Testing Commands Locally

Before deploying slash commands:
1. Test DB operations with test slugs
2. Test file creation in `content/projects/`
3. Run health check after each operation
4. Delete test data before committing

### Known Quirks

- Safari has slightly different spacing than Chrome (minor, acceptable)
- Work Log section only shows if notes exist (returns null otherwise)
- First H2 in markdown has `first:mt-0` to remove top margin

---

## File Locations Reference

**Database:**
- Schema: `supabase-projects-schema.sql`
- Client: `lib/supabase.ts` (exports `supabaseClient`)

**API Routes:**
- `/api/projects` - List all projects
- `/api/projects/[slug]` - Single project by slug
- `/api/notes` - Work logs (with project filter)

**Pages:**
- `/app/projects/page.tsx` - Projects listing
- `/app/projects/[id]/page.tsx` - Project detail (SSR with generateMetadata)
- `/app/projects/[id]/WorkLogSection.tsx` - Collapsible work log

**Content:**
- `/content/projects/*.md` - Project markdown files

**Scripts:**
- `/scripts/migrate-projects.js` - One-time migration (done)
- `/scripts/project-health.js` - TO BE CREATED

**Commands:**
- `.claude/commands/create-project.md` - NEEDS REFACTOR
- `.claude/commands/update-project.md` - TO BE CREATED
- `.claude/commands/log-work.md` - Already writes to DB (working)

---

## Next Session Checklist

1. [ ] Create `/scripts/project-health.js`
2. [ ] Test health script with current 3 projects
3. [ ] Add to build pipeline
4. [ ] Create `/update-project` command
5. [ ] Test update command on ai-art project
6. [ ] Refactor `/create-project` to write to DB + create markdown
7. [ ] Test create command with dummy project
8. [ ] Delete test project and verify cleanup
9. [ ] Update DEV_DIARY.md with this session's work
10. [ ] Git commit all changes
11. [ ] Deploy to production

---

## Questions to Ask User

- Should `/create-project` open markdown file in editor after creation?
- Should health check run automatically on every commit (git hook)?
- Do we want bulk operations (update multiple projects at once)?
- Should there be a `/delete-project` command with safety checks?
