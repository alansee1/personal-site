-- =====================================================
-- PROJECTS TABLE MIGRATION
-- =====================================================
-- This script creates the projects table with integer IDs
-- and migrates existing notes to reference integer project_id
-- =====================================================

-- Step 1: Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,              -- Folder name: 'personal-site'
  title TEXT NOT NULL,                    -- Display: 'Personal Website'
  description TEXT NOT NULL,              -- Short description for cards
  long_description TEXT,                  -- Longer description for detail page
  status TEXT DEFAULT 'active',           -- 'active', 'completed', 'paused'
  tech JSONB NOT NULL DEFAULT '[]'::jsonb, -- ["Next.js", "TypeScript"]
  github TEXT,                            -- GitHub URL (nullable)
  url TEXT,                               -- Live site URL (nullable)
  media JSONB DEFAULT '[]'::jsonb,        -- Videos, images, before/after
  start_date DATE,                        -- Project start date
  end_date DATE,                          -- Project end date (nullable)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects (slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects (created_at DESC);

-- Step 3: Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 4: Set up Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to projects"
  ON projects
  FOR SELECT
  USING (true);

-- Block all write access from browser (writes come from local machine with service role key)
CREATE POLICY "Block public write access to projects"
  ON projects
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Block public update access to projects"
  ON projects
  FOR UPDATE
  USING (false);

CREATE POLICY "Block public delete access to projects"
  ON projects
  FOR DELETE
  USING (false);

-- =====================================================
-- NOTES TABLE MIGRATION
-- =====================================================
-- Migrate notes.project_id from TEXT slugs to INTEGER FK
-- =====================================================

-- NOTE: Run this AFTER inserting the 3 projects via migration script
-- The migration script will provide the mapping of slugs to IDs

-- Step 5: Add temporary column for new integer project_id
ALTER TABLE notes ADD COLUMN IF NOT EXISTS project_id_new INTEGER;

-- Step 6: Update mapping (RUN THESE AFTER MIGRATION SCRIPT)
-- UPDATE notes SET project_id_new = 1 WHERE project_id = 'personal-site';
-- UPDATE notes SET project_id_new = 2 WHERE project_id = 'weight-tracker';
-- UPDATE notes SET project_id_new = 3 WHERE project_id = 'ai-art';

-- Step 7: Verify all notes have been mapped
-- SELECT COUNT(*) FROM notes WHERE project_id_new IS NULL;
-- (Should be 0)

-- Step 8: Drop old column and rename new one
-- ALTER TABLE notes DROP COLUMN project_id;
-- ALTER TABLE notes RENAME COLUMN project_id_new TO project_id;
-- ALTER TABLE notes ALTER COLUMN project_id SET NOT NULL;

-- Step 9: Add foreign key constraint
-- ALTER TABLE notes
--   ADD CONSTRAINT fk_project
--   FOREIGN KEY (project_id)
--   REFERENCES projects(id)
--   ON DELETE CASCADE;

-- Step 10: Add index for performance
-- CREATE INDEX IF NOT EXISTS idx_notes_project_id ON notes (project_id);
