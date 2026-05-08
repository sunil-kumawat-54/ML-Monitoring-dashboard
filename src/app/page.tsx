"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/lib/AuthContext";
import { generateSimulationData, simulateTick } from "@/lib/simulation";
import { saveDashboardSnapshot, saveAlert } from "@/lib/supabase-data";

import HeroKPIStrip from "@/components/widgets/HeroKPIStrip";
import DataDriftPanel from "@/components/widgets/DataDriftPanel";
import PerformanceTimeline from "@/components/widgets/PerformanceTimeline";
import PredictionCalibration from "@/components/widgets/PredictionCalibration";
import FeatureImportanceShift from "@/components/widgets/FeatureImportanceShift";
import AlertFeed from "@/components/widgets/AlertFeed";
import ReportsPanel from "@/components/widgets/ReportsPanel";

export default function Dashboard() {
  const { scenario, isLive, setData, data } = useStore();
  const { user } = useAuth();

  // Initial Data Generation & Scenario Change — also saves snapshot to Supabase
  useEffect(() => {
    const newData = generateSimulationData(scenario);
    setData(newData);
    if (user) {
      saveDashboardSnapshot(user.id, scenario, newData);
      // Save any generated alerts
      newData.alerts.forEach((alert) => saveAlert(alert, user.id));
    }
  }, [scenario, setData, user]);

  // Live Tick Simulation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      useStore.setState((state) => {
        if (!state.data) return state;
        return { data: simulateTick(state.data, state.scenario) };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive, scenario]);

  if (!data) return null;

  return (
    <>
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted mt-1">Real-time model monitoring and data drift analysis.</p>
        </div>
      </div>

      <HeroKPIStrip />
      <DataDriftPanel />
      <PerformanceTimeline />
      <PredictionCalibration />
      <FeatureImportanceShift />
      <AlertFeed />
      <ReportsPanel />
    </>
  );
}
