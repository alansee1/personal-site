-- =====================================================
-- Notes Table Schema for Personal Site
-- =====================================================

-- Create the notes table
CREATE TABLE notes (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  project_id TEXT NOT NULL,
  summary TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_notes_timestamp ON notes (timestamp DESC);
CREATE INDEX idx_notes_project_id ON notes (project_id);
CREATE INDEX idx_notes_tags ON notes USING GIN (tags);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow anyone to read notes (public data)
CREATE POLICY "Public read access"
  ON notes
  FOR SELECT
  USING (true);

-- RLS Policy: Block all public inserts (only API can insert via service role)
CREATE POLICY "No public inserts"
  ON notes
  FOR INSERT
  WITH CHECK (false);

-- RLS Policy: Block all public updates
CREATE POLICY "No public updates"
  ON notes
  FOR UPDATE
  USING (false);

-- RLS Policy: Block all public deletes
CREATE POLICY "No public deletes"
  ON notes
  FOR DELETE
  USING (false);

-- Add comments for documentation
COMMENT ON TABLE notes IS 'Work log entries for projects';
COMMENT ON COLUMN notes.id IS 'Auto-incrementing primary key';
COMMENT ON COLUMN notes.timestamp IS 'When the work was done (user-provided)';
COMMENT ON COLUMN notes.project_id IS 'Foreign key to projects.id (not enforced, projects still in JSON)';
COMMENT ON COLUMN notes.summary IS 'Brief description of work completed';
COMMENT ON COLUMN notes.tags IS 'Array of tags for categorization (e.g., ["bug-fix", "ui"])';
COMMENT ON COLUMN notes.created_at IS 'When this record was inserted into the database';
COMMENT ON COLUMN notes.updated_at IS 'When this record was last modified';
