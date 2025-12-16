-- Allow super admins to manage categories
-- NOTE: categories table has RLS enabled in schema.sql but no policies for CRUD.

DO $$
BEGIN
  -- Drop existing policy if it exists (idempotent)
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'categories'
      AND policyname = 'Super admin full access categories'
  ) THEN
    EXECUTE 'DROP POLICY "Super admin full access categories" ON public.categories';
  END IF;
END $$;

CREATE POLICY "Super admin full access categories"
ON public.categories
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'super_admin'
  )
);

