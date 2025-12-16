-- Add lesson preview flag for "free preview" lessons.
-- This is referenced by the course builder save endpoint (`lessons.is_preview`).

alter table public.lessons
add column if not exists is_preview boolean not null default false;

