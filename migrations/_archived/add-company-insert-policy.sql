-- =============================================================================
-- Add INSERT policy for companies table
-- =============================================================================
-- This script adds an INSERT policy to allow admins to create companies
-- =============================================================================

-- Policy: Allow admins to insert new companies
CREATE POLICY "Admins can insert companies"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
