---
description: Create a new blog post with frontmatter, regenerate blog.json, and optionally commit
---

# /create-blog-post - Blog Post Creation Wizard

This slash command guides you through creating a new blog post for your personal site, handling all the setup automatically.

## Overview

Creates a new markdown blog post with proper frontmatter, regenerates blog.json, and optionally commits the changes to git.

## Step 1: Gather Post Information

Ask the user for the following information (one prompt with multiple fields):

```
Let's create a new blog post!

1. Title: [What's the title of your post?]
2. Description: [One-line description for SEO/previews (optional)]
3. Tags: [Comma-separated tags like "automation, nextjs, workflow" (optional)]
4. Published: [Should this be published? (yes/no, default: no for draft)]
5. Draft Content: [Would you like me to create a starter outline? (yes/no)]
```

**Wait for user response before proceeding.**

## Step 2: Generate Slug

From the provided title, generate a URL-friendly slug:

1. Convert to lowercase
2. Replace spaces with hyphens
3. Remove special characters (keep only a-z, 0-9, hyphens)
4. Remove consecutive hyphens

**Examples:**
- "The Future of Development" → "the-future-of-development"
- "Building a Next.js Blog!" → "building-a-nextjs-blog"
- "AI & Automation: A Guide" → "ai-automation-a-guide"

**Show the generated slug to the user:**
```
Generated slug: [slug]

This will create the file: content/blog/[slug].md
Post URL: https://alansee.dev/blog/[slug]

Looks good? (yes/edit)
```

If user says "edit", ask for their preferred slug.

## Step 3: Prepare Frontmatter

Create the frontmatter block:

```yaml
---
title: "[user's title]"
slug: "[generated/edited slug]"
date: "[today's date in YYYY-MM-DD format]"
description: "[user's description or default: 'A blog post about [title]']"
tags: [array of tags from user input, or empty array]
published: [true/false based on user input]
---
```

## Step 4: Create Content Template

**If user requested a starter outline:**
Create a basic blog post template with placeholder sections:

```markdown
# [Title]

[Introduction paragraph - set the scene, hook the reader]

## Background

[Why does this topic matter? What's the context?]

## The Problem

[What challenge are you addressing?]

## The Solution

[Your approach, implementation, or insights]

## Example

[Code snippet, walkthrough, or concrete example]

## Conclusion

[Key takeaways, next steps, or call to action]
```

**If user did NOT request an outline:**
Just add a simple starter:

```markdown
# [Title]

[Start writing your blog post here...]
```

## Step 5: Show Full Preview

Display the complete file that will be created:

```markdown
I'll create this file at: content/blog/[slug].md

---
title: "[title]"
slug: "[slug]"
date: "[date]"
description: "[description]"
tags: ["tag1", "tag2"]
published: [true/false]
---

[content template from Step 4]
---

Would you like to:
1. Create this post (yes)
2. Edit the content first (edit)
3. Cancel (no)
```

**Wait for user response.**

**If "edit":** Ask what they'd like to change (title, description, tags, content template, etc.)

## Step 6: Create the Blog Post File

Once approved, write the file:

```bash
# Write to content/blog/[slug].md
```

**Verify file was created successfully.**

## Step 7: Regenerate blog.json

Run the blog data generator:

```bash
node scripts/generate-blog-data.js
```

**Check output to confirm blog.json was updated.**

## Step 8: Confirm Success

```
✅ Blog post created!

File: content/blog/[slug].md
Preview: http://localhost:3000/blog/[slug] (if dev server running)
Production: https://alansee.dev/blog/[slug] (after deployment)

Status: [Draft/Published]
```

## Step 9: Ask About Git Operations

```
Would you like to commit and push this? (yes/no)
```

**If yes, continue to Step 10.**
**If no, stop here.**

## Step 10: Git Commit & Push

Execute git operations:

```bash
git add content/blog/[slug].md data/blog.json

git commit -m "$(cat <<'EOF'
Add blog post: [first 50 chars of title]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

git push
```

**If any command fails, report error and stop.**

## Step 11: Monitor Deployment (if pushed)

After successful push:

```
🚀 Pushed to GitHub! Monitoring Vercel deployment...

Waiting 60 seconds for deployment to start...
```

Wait 60 seconds, then check deployment status (similar to /log-work).

**Final success message:**
```
✅ Blog post created and deployed!

📝 Post: [title]
🔗 Live at: https://alansee.dev/blog/[slug]
📊 Status: [Draft/Published]

[If draft] Note: This post won't appear on the site until you set published: true
```

## Error Handling

**File already exists:**
```
❌ Error: A blog post with slug "[slug]" already exists.

Would you like to:
1. Use a different slug (edit)
2. Cancel (no)
```

**Blog.json generation fails:**
```
❌ Error: Failed to regenerate blog.json
[Show error details]

The markdown file was created, but blog.json wasn't updated.
You may need to run: node scripts/generate-blog-data.js
```

**Git operations fail:**
```
❌ Git error: [error message]

The blog post file was created successfully, but git operations failed.
You can manually commit with:
  git add content/blog/[slug].md data/blog.json
  git commit -m "Add blog post: [title]"
  git push
```

## Special Features

### Auto-Tag Suggestions

If user doesn't provide tags, suggest common ones based on title/description:

```
I noticed you didn't add tags. Here are some suggestions based on your title:

Suggested: [automation, workflow, nextjs]

Would you like to use these? (yes/edit/skip)
```

### Slug Collision Prevention

Before creating the file, check if a post with that slug already exists:
- Check `content/blog/[slug].md`
- Check `data/blog.json` for existing slug

If collision detected, automatically append `-2`, `-3`, etc. and inform user.

## Content Templates by Topic

If the title suggests a specific type of post, use a relevant template:

**Tutorial/Guide:** (contains "how to", "guide", "tutorial")
```markdown
# Introduction
## Prerequisites
## Step 1: [First Step]
## Step 2: [Second Step]
## Troubleshooting
## Conclusion
```

**Review/Comparison:** (contains "vs", "review", "comparison")
```markdown
# Overview
## Option A: [First Thing]
## Option B: [Second Thing]
## Comparison
## Recommendation
## Conclusion
```

**Case Study:** (contains "case study", "how I", "how we")
```markdown
# The Challenge
## The Approach
## Implementation
## Results
## Lessons Learned
## Conclusion
```

**Default:** Use the standard template from Step 4.

## Tips for Writing Good Posts

After creating the post, optionally show writing tips:

```
💡 Tips for a great blog post:
- Start with a hook that grabs attention
- Use code examples with syntax highlighting
- Break up text with headings and lists
- Add your personal experience and insights
- End with actionable takeaways

Edit your post at: content/blog/[slug].md
```

## Notes

- This command is **personal-site specific** (lives in personal-site/.claude/commands/)
- Posts default to `published: false` (drafts) for safety
- Slug generation follows standard URL conventions
- blog.json is automatically regenerated on every build
- Dev server hot-reloads when you edit markdown files
- Use `published: false` to work on drafts without deploying them

## Examples

### Example 1: Quick Draft
```
User: /create-blog-post

Title: My First Post
Description: [skips]
Tags: [skips]
Published: no
Draft Content: no

→ Creates draft with minimal template
→ File: content/blog/my-first-post.md
→ Status: Draft
```

### Example 2: Full Published Post
```
User: /create-blog-post

Title: The Future of Development Workflow
Description: How AI-powered slash commands are revolutionizing developer workflows
Tags: automation, ai, workflow, developer-tools
Published: yes
Draft Content: yes

→ Creates published post with full outline
→ Commits and pushes to GitHub
→ Deploys to production
→ Live at: alansee.dev/blog/the-future-of-development-workflow
```

### Example 3: Tutorial Post
```
User: /create-blog-post

Title: How to Build a Next.js Blog
Description: Step-by-step guide to building a markdown blog
Tags: nextjs, tutorial, react
Published: no
Draft Content: yes

→ Detects "How to" in title
→ Uses tutorial template
→ Creates comprehensive outline
→ Saves as draft for editing
```

## When to Use This Command

**Good use cases:**
- ✅ Starting a new blog post
- ✅ Creating a quick draft to flesh out later
- ✅ Publishing a post you've already written elsewhere (paste content when prompted)
- ✅ Batch creating multiple post outlines

**When not to use:**
- ❌ Editing an existing post (just edit the .md file directly)
- ❌ Deleting a post (manually delete the file and regenerate blog.json)
- ❌ Reordering posts (posts are auto-sorted by date)

Remember: You can always edit the markdown file directly after creation. This command just handles the initial setup and boilerplate!
