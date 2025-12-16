-- Add is_preview column to lessons table
-- Allows marking specific lessons as free previews for non-enrolled users

ALTER TABLE IF EXISTS public.lessons
  ADD COLUMN IF NOT EXISTS is_preview BOOLEAN DEFAULT false NOT NULL;

-- Add comment explaining the column purpose
COMMENT ON COLUMN public.lessons.is_preview IS 'When true, this lesson can be viewed by non-enrolled users as a free preview';
