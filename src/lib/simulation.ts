import { DashboardData, Scenario, FeatureDrift, MetricTimelinePoint, FeatureImportance, Alert } from "./types";

const FEATURE_NAMES = [
  "age", "income", "credit_score", "transaction_amount", "merchant_category",
  "location_id", "device_type", "time_of_day", "is_weekend", "previous_declines",
  "account_age_days", "velocity_1h", "velocity_24h", "distance_from_home", "ip_risk_score"
];

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const generateDist = (skew: number, base: number = 0) => {
  return Array.from({ length: 20 }, (_, i) => {
    const x = i / 20;
    // Simple skewed bell curve
    return Math.max(0.01, Math.exp(-Math.pow(x - skew, 2) * 10) + base + random(-0.05, 0.05));
  });
};

export const generateSimulationData = (scenario: Scenario): DashboardData => {
  const isHealthy = scenario === "Healthy";
  const isSevere = scenario === "Severe";

  const healthScore = isHealthy ? 92 : isSevere ? 48 : 74;
  const overallPsi = isHealthy ? 0.08 : isSevere ? 0.35 : 0.18;
  
  const accCurrent = isHealthy ? 95.2 : isSevere ? 88.0 : 93.4;
  const accDelta = isHealthy ? 0.2 : isSevere ? -7.2 : -1.8;
  
  const features: FeatureDrift[] = FEATURE_NAMES.map((name, i) => {
    // 3 drifting for moderate, 8 for severe
    const shouldDrift = isSevere ? i < 8 : (!isHealthy && i < 3);
    const psi = shouldDrift ? random(0.2, 0.45) : random(0.01, 0.09);
    const status = psi > 0.25 ? "critical" : psi > 0.1 ? "warning" : "healthy";
    
    return {
      name,
      psi,
      status,
      history: Array.from({ length: 14 }, () => Math.max(0, psi + random(-0.02, 0.02))),
      referenceDist: generateDist(0.5),
      currentDist: generateDist(shouldDrift ? 0.7 : 0.5, shouldDrift ? random(0.1, 0.3) : 0),
      ksStat: shouldDrift ? random(0.3, 0.6) : random(0.05, 0.15),
      pValue: shouldDrift ? random(0.0001, 0.01) : random(0.1, 0.8),
      wasserstein: shouldDrift ? random(0.2, 0.5) : random(0.01, 0.05)
    };
  });

  const timeline: MetricTimelinePoint[] = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const drop = isSevere && i > 15 ? (i - 15) * 0.4 : isHealthy ? 0 : i > 20 ? (i - 20) * 0.2 : 0;
    return {
      timestamp: d,
      accuracy: 95 - drop + random(-0.5, 0.5),
      aucRoc: 0.96 - (drop / 100) + random(-0.01, 0.01),
      f1Score: 0.93 - (drop / 100) + random(-0.02, 0.02),
      precision: 0.94 - (drop / 100) + random(-0.02, 0.02),
      recall: 0.92 - (drop / 100) + random(-0.02, 0.02),
      logLoss: 0.15 + (drop / 50) + random(-0.01, 0.01)
    };
  });

  const importance: FeatureImportance[] = FEATURE_NAMES.map((name) => {
    const ref = random(0.01, 0.15);
    const curr = ref * random(0.8, 1.2);
    return {
      name,
      reference: ref,
      current: curr,
      delta: Math.abs(curr - ref),
      direction: curr > ref ? "up" : "down"
    };
  }).sort((a, b) => b.current - a.current);

  const alerts: Alert[] = [];
  if (!isHealthy) {
    alerts.push({
      id: Math.random().toString(36),
      timestamp: new Date(),
      level: isSevere ? "critical" : "warning",
      title: "PSI exceeded threshold",
      detail: `Feature '${FEATURE_NAMES[0]}' PSI reached ${features[0].psi.toFixed(3)}`
    });
    if (isSevere) {
      alerts.push({
        id: Math.random().toString(36),
        timestamp: new Date(Date.now() - 3600000),
        level: "critical",
        title: "Accuracy Drop Detected",
        detail: `Model accuracy fell below 90% critical threshold (current: 88.0%)`
      });
    }
  }

  return {
    healthScore,
    overallPsi,
    accuracy: { current: accCurrent, delta: accDelta, history: Array.from({length: 7}, () => accCurrent + random(-1, 1)) },
    predictionVolume: { 
      count: Math.floor(random(1.2e6, 1.3e6)), 
      throughput: random(14.0, 15.0),
      history: Array.from({length: 24}, () => random(10, 20))
    },
    features: features.sort((a, b) => b.psi - a.psi),
    timeline,
    alerts,
    importance,
    calibration: { brier: isHealthy ? 0.08 : 0.15, ece: isHealthy ? 0.02 : 0.07 }
  };
};

export const simulateTick = (currentData: DashboardData, scenario: Scenario): DashboardData => {
  // Add small random noise to make it feel alive
  return {
    ...currentData,
    predictionVolume: {
      ...currentData.predictionVolume,
      count: currentData.predictionVolume.count + Math.floor(random(1, 15)),
      throughput: currentData.predictionVolume.throughput + random(-0.1, 0.1),
      history: [...currentData.predictionVolume.history.slice(1), random(10, 20)]
    }
  };
};
