export type Scenario = "Healthy" | "Moderate" | "Severe";

export interface Alert {
  id: string;
  timestamp: Date;
  level: "warning" | "critical" | "resolved";
  title: string;
  detail: string;
}

export interface FeatureDrift {
  name: string;
  psi: number;
  status: "healthy" | "warning" | "critical";
  history: number[]; // 14 days
  referenceDist: number[];
  currentDist: number[];
  ksStat: number;
  pValue: number;
  wasserstein: number;
}

export interface MetricTimelinePoint {
  timestamp: Date;
  accuracy: number;
  aucRoc: number;
  f1Score: number;
  precision: number;
  recall: number;
  logLoss: number;
}

export interface FeatureImportance {
  name: string;
  reference: number;
  current: number;
  delta: number;
  direction: "up" | "down";
}

export interface DashboardData {
  healthScore: number;
  overallPsi: number;
  accuracy: { current: number; delta: number; history: number[] };
  predictionVolume: { count: number; throughput: number; history: number[] };
  features: FeatureDrift[];
  timeline: MetricTimelinePoint[];
  alerts: Alert[];
  importance: FeatureImportance[];
  calibration: { brier: number; ece: number };
}
