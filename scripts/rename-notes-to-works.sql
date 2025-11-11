-- Migration: Rename 'notes' table to 'works'
-- This migration renames the notes table and all associated objects (indexes, policies, etc.)

BEGIN;

-- Step 1: Rename the table
ALTER TABLE notes RENAME TO works;

-- Step 2: Rename indexes
ALTER INDEX idx_notes_timestamp RENAME TO idx_works_timestamp;
ALTER INDEX idx_notes_project_id RENAME TO idx_works_project_id;
ALTER INDEX idx_notes_tags RENAME TO idx_works_tags;

-- Step 3: Update table comment
COMMENT ON TABLE works IS 'Work log entries for projects';

-- Step 4: Drop old policies (they reference the old table name)
DROP POLICY IF EXISTS "Public read access" ON works;
DROP POLICY IF EXISTS "No public inserts" ON works;
DROP POLICY IF EXISTS "No public updates" ON works;
DROP POLICY IF EXISTS "No public deletes" ON works;

-- Step 5: Recreate policies with same logic
CREATE POLICY "Public read access"
  ON works
  FOR SELECT
  USING (true);

CREATE POLICY "No public inserts"
  ON works
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No public updates"
  ON works
  FOR UPDATE
  USING (false);

CREATE POLICY "No public deletes"
  ON works
  FOR DELETE
  USING (false);

COMMIT;
