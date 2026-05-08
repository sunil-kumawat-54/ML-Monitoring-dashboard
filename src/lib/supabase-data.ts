import { supabase } from "./supabase";
import type { Alert, DashboardData } from "./types";

// ─── Alerts ───────────────────────────────────────────────
export async function saveAlert(alert: Alert, userId: string) {
  const { error } = await supabase.from("alerts").insert({
    id: alert.id,
    user_id: userId,
    level: alert.level,
    title: alert.title,
    detail: alert.detail,
    created_at: alert.timestamp.toISOString(),
  });
  if (error) console.error("Failed to save alert:", error.message);
}

export async function fetchAlerts(userId: string): Promise<Alert[]> {
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to fetch alerts:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    timestamp: new Date(row.created_at),
    level: row.level,
    title: row.title,
    detail: row.detail,
  }));
}

export async function acknowledgeAlertInDb(alertId: string) {
  const { error } = await supabase
    .from("alerts")
    .update({ level: "resolved" })
    .eq("id", alertId);
  if (error) console.error("Failed to acknowledge alert:", error.message);
}

// ─── Dashboard Snapshots ──────────────────────────────────
export async function saveDashboardSnapshot(
  userId: string,
  scenario: string,
  data: DashboardData
) {
  const { error } = await supabase.from("dashboard_snapshots").insert({
    user_id: userId,
    scenario,
    health_score: data.healthScore,
    overall_psi: data.overallPsi,
    accuracy_current: data.accuracy.current,
    accuracy_delta: data.accuracy.delta,
    prediction_count: data.predictionVolume.count,
    brier_score: data.calibration.brier,
    ece_score: data.calibration.ece,
    snapshot_data: JSON.stringify(data),
  });
  if (error) console.error("Failed to save snapshot:", error.message);
}

export async function fetchLatestSnapshot(
  userId: string
): Promise<{ scenario: string; data: DashboardData } | null> {
  const { data, error } = await supabase
    .from("dashboard_snapshots")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;

  return {
    scenario: data.scenario,
    data: JSON.parse(data.snapshot_data),
  };
}
