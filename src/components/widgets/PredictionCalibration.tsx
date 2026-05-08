"use client";

import { useStore } from "@/store/useStore";
import { ResponsiveContainer, AreaChart, Area, ReferenceLine, XAxis, YAxis, LineChart, Line } from "recharts";

export default function PredictionCalibration() {
  const { data } = useStore();

  if (!data) return null;

  // Mock violin/distribution data
  const distData = Array.from({ length: 20 }, (_, i) => {
    const x = i / 20;
    return {
      x: x.toFixed(2),
      ref: Math.exp(-Math.pow(x - 0.5, 2) * 20) + Math.random() * 0.1,
      curr: Math.exp(-Math.pow(x - (data.healthScore > 80 ? 0.5 : 0.6), 2) * 20) + Math.random() * 0.1,
    };
  });

  // Mock calibration curve data
  const calibData = Array.from({ length: 10 }, (_, i) => {
    const p = (i + 0.5) / 10;
    const error = data.healthScore > 80 ? (Math.random() - 0.5) * 0.05 : (Math.random() - 0.5) * 0.15 + (p > 0.5 ? -0.1 : 0.1);
    return {
      p: p,
      actual: Math.max(0, Math.min(1, p + error)),
      perfect: p
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Left: Prediction Distribution */}
      <div className="bg-card p-6 flex flex-col">
        <h3 className="text-section-title mb-6">Prediction Drift</h3>
        <div className="flex-1 h-[200px] mb-4 relative">
          <div className="absolute top-0 right-0 flex gap-3 text-[10px] text-muted z-10">
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-ion-blue/40 rounded-sm" /> Ref</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-plasma/60 rounded-sm" /> Curr</div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={distData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="x" stroke="#4b5a7a" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#4b5a7a" fontSize={10} tickLine={false} axisLine={false} />
              <Area type="monotone" dataKey="ref" stroke="#3d9bff" fill="rgba(61,155,255,0.2)" strokeWidth={2} />
              <Area type="monotone" dataKey="curr" stroke="#a855f7" fill="rgba(168,85,247,0.4)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-emerald/20 flex items-center justify-center text-[10px] font-mono text-emerald border-t-emerald">
              .08
            </div>
            <div className="text-xs text-muted uppercase tracking-wider">PSI Score</div>
          </div>
          <div className={`text-[10px] font-mono px-2 py-1 rounded ${data.healthScore > 80 ? 'bg-emerald/10 text-emerald' : 'bg-amber/10 text-amber'}`}>
            {data.healthScore > 80 ? 'STABLE' : 'MODERATE SHIFT'}
          </div>
        </div>
      </div>

      {/* Right: Calibration */}
      <div className="bg-card p-6 flex flex-col">
        <h3 className="text-section-title mb-6">Calibration Plot</h3>
        <div className="flex-1 h-[200px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={calibData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="p" stroke="#4b5a7a" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#4b5a7a" fontSize={10} tickLine={false} axisLine={false} />
              <Line type="monotone" dataKey="perfect" stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" dot={false} />
              <Line type="monotone" dataKey="actual" stroke="#3d9bff" strokeWidth={2} dot={{ r: 4, fill: "#3d9bff", stroke: "#0b0f1e" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-xs font-mono">
          <div>
            <span className="text-muted block mb-1">Brier Score</span>
            <span className="text-white text-lg">{data.calibration.brier.toFixed(3)}</span>
          </div>
          <div>
            <span className="text-muted block mb-1">Expected Calibration Error</span>
            <span className="text-white text-lg">{data.calibration.ece.toFixed(3)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
