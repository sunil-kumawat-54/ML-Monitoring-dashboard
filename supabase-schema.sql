-- ====================================
-- ML Monitoring Dashboard - Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ====================================

-- 1. Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  level TEXT CHECK (level IN ('warning', 'critical', 'resolved')) NOT NULL,
  title TEXT NOT NULL,
  detail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Dashboard Snapshots Table
CREATE TABLE IF NOT EXISTS dashboard_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scenario TEXT CHECK (scenario IN ('Healthy', 'Moderate', 'Severe')) NOT NULL,
  health_score NUMERIC,
  overall_psi NUMERIC,
  accuracy_current NUMERIC,
  accuracy_delta NUMERIC,
  prediction_count INTEGER,
  brier_score NUMERIC,
  ece_score NUMERIC,
  snapshot_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security (RLS)
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_snapshots ENABLE ROW LEVEL SECURITY;

-- Users can only see/modify their own alerts
CREATE POLICY "Users can read own alerts"
  ON alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts"
  ON alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only see/modify their own snapshots
CREATE POLICY "Users can read own snapshots"
  ON dashboard_snapshots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own snapshots"
  ON dashboard_snapshots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_snapshots_user_id ON dashboard_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_created_at ON dashboard_snapshots(created_at DESC);
