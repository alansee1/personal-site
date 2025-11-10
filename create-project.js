const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '/Users/alansee/Projects/personal-site/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createProject() {
  // Insert into database
  const { data, error } = await supabase
    .from('projects')
    .insert({
      slug: 'nba-90ers',
      title: 'nba-90ers',
      description: 'Automated NBA betting analysis tool that identifies players who consistently hit stat thresholds (90%ers) by comparing historical performance to betting lines',
      status: 'active',
      tech: ['Python', 'nba_api', 'pandas', 'matplotlib', 'The Odds API'],
      github: null,
      url: null,
      start_date: '2025-11-09'
    })
    .select()
    .single();

  if (error) {
    console.error('Database error:', error.message);
    process.exit(1);
  }

  console.log('✅ Inserted project:', data.slug);

  // Create markdown file
  const markdownContent = `---
slug: ${data.slug}
---

## Overview

${data.description}

## What We Built

[Detailed explanation of the project - to be filled in later]

## Key Features

- Feature 1
- Feature 2
- Feature 3

## Technical Highlights

[Technical details, architecture decisions, interesting problems solved]

## Future Enhancements

- Enhancement 1
- Enhancement 2
`;

  const markdownPath = path.join('/Users/alansee/Projects/personal-site/content/projects', `${data.slug}.md`);
  fs.writeFileSync(markdownPath, markdownContent);

  console.log('✅ Created markdown file:', markdownPath);
}

createProject();
