-- Ensure courses table has expected admin fields
-- Fixes PostgREST PGRST204 errors when app writes is_active/is_featured/original_prompt

ALTER TABLE IF EXISTS public.courses
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

ALTER TABLE IF EXISTS public.courses
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

ALTER TABLE IF EXISTS public.courses
  ADD COLUMN IF NOT EXISTS original_prompt TEXT;
