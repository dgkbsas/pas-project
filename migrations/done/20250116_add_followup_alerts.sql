-- Migration: Add alert functionality to policy_followups
-- Created: 2025-01-16
-- Description: Add alert_date field to policy_followups for notification system

-- Add alert_date column to policy_followups table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'policy_followups'
    AND column_name = 'alert_date'
  ) THEN
    ALTER TABLE public.policy_followups
    ADD COLUMN alert_date DATE NULL;
  END IF;
END $$;

-- Add index for alert_date for better query performance
CREATE INDEX IF NOT EXISTS idx_policy_followups_alert_date
  ON public.policy_followups(alert_date)
  WHERE alert_date IS NOT NULL;

-- Add column comment for documentation
COMMENT ON COLUMN public.policy_followups.alert_date IS 'Optional date for alert notification about this followup';
