-- =====================================================
-- Works Table Schema for Personal Site
-- =====================================================

-- Create the works table
CREATE TABLE works (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  project_id TEXT NOT NULL,
  summary TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_works_timestamp ON works (timestamp DESC);
CREATE INDEX idx_works_project_id ON works (project_id);
CREATE INDEX idx_works_tags ON works USING GIN (tags);

-- Enable Row Level Security
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow anyone to read works (public data)
CREATE POLICY "Public read access"
  ON works
  FOR SELECT
  USING (true);

-- RLS Policy: Block all public inserts (only API can insert via service role)
CREATE POLICY "No public inserts"
  ON works
  FOR INSERT
  WITH CHECK (false);

-- RLS Policy: Block all public updates
CREATE POLICY "No public updates"
  ON works
  FOR UPDATE
  USING (false);

-- RLS Policy: Block all public deletes
CREATE POLICY "No public deletes"
  ON works
  FOR DELETE
  USING (false);

-- Add comments for documentation
COMMENT ON TABLE works IS 'Work log entries for projects';
COMMENT ON COLUMN works.id IS 'Auto-incrementing primary key';
COMMENT ON COLUMN works.timestamp IS 'When the work was done (user-provided)';
COMMENT ON COLUMN works.project_id IS 'Foreign key to projects.id (not enforced, projects still in JSON)';
COMMENT ON COLUMN works.summary IS 'Brief description of work completed';
COMMENT ON COLUMN works.tags IS 'Array of tags for categorization (e.g., ["bug-fix", "ui"])';
COMMENT ON COLUMN works.created_at IS 'When this record was inserted into the database';
COMMENT ON COLUMN works.updated_at IS 'When this record was last modified';
