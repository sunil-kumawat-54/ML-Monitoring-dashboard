"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDown, AlertTriangle } from "lucide-react";

export default function DataDriftPanel() {
  const { data } = useStore();
  const [selectedFeatureIdx, setSelectedFeatureIdx] = useState(0);
  const [hoverCell, setHoverCell] = useState<{fIdx: number, dIdx: number, x: number, y: number} | null>(null);

  if (!data) return null;

  const features = data.features;
  const selectedFeature = features[selectedFeatureIdx];

  const getPsiColor = (psi: number) => {
    if (psi > 0.25) return "#ef4444"; // crimson
    if (psi > 0.1) return "#f59e0b"; // amber
    return "#10b981"; // emerald
  };

  const getPsiOpacity = (psi: number) => {
    return Math.min(1, Math.max(0.1, psi * 3));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      {/* Left: Heatmap (8 col) */}
      <div className="lg:col-span-8 bg-card p-6 flex flex-col">
        <h3 className="text-section-title mb-6">Feature Drift Monitor</h3>
        
        {/* Heatmap Grid */}
        <div className="relative flex-1" onMouseLeave={() => setHoverCell(null)}>
          <div className="flex text-[10px] text-muted font-mono mb-2">
            <div className="w-[120px] shrink-0">Feature</div>
            <div className="flex-1 flex justify-between px-2">
              <span>14 days ago</span>
              <span>Today</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-[2px]">
            {features.map((f, fIdx) => (
              <div 
                key={f.name} 
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => setSelectedFeatureIdx(fIdx)}
              >
                <div className="w-[120px] shrink-0 text-xs text-muted group-hover:text-primary transition-colors truncate">
                  {f.name}
                </div>
                <div className="flex-1 flex gap-[2px] h-[18px]">
                  {f.history.map((val, dIdx) => (
                    <motion.div
                      key={dIdx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (fIdx * 0.02) + (dIdx * 0.01) }}
                      className="flex-1 rounded-[2px] hover:ring-1 hover:ring-white/50 transition-all z-0 hover:z-10 relative"
                      style={{ 
                        backgroundColor: getPsiColor(val),
                        opacity: getPsiOpacity(val)
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoverCell({ fIdx, dIdx, x: rect.left + rect.width/2, y: rect.top });
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Tooltip */}
          <AnimatePresence>
            {hoverCell && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.15 }}
                className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-[120%] bg-surface-elevated border border-white/10 p-3 rounded-lg shadow-2xl backdrop-blur-md w-[200px]"
                style={{ left: hoverCell.x, top: hoverCell.y }}
              >
                <div className="text-xs font-semibold mb-1 text-white">{features[hoverCell.fIdx].name}</div>
                <div className="text-[10px] text-muted font-mono mb-2">Day {14 - hoverCell.dIdx}</div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted">PSI Score</span>
                  <span className="font-mono font-bold" style={{ color: getPsiColor(features[hoverCell.fIdx].history[hoverCell.dIdx]) }}>
                    {features[hoverCell.fIdx].history[hoverCell.dIdx].toFixed(3)}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: Distribution (4 col) */}
      <div className="lg:col-span-4 bg-card p-6 flex flex-col">
        <h3 className="text-section-title mb-6">Distribution Shift</h3>
        
        {/* Selector */}
        <div className="relative mb-6">
          <select 
            className="w-full appearance-none bg-surface border border-ion-blue/20 rounded-full px-4 py-2 text-sm text-primary outline-none cursor-pointer hover:border-ion-blue/50 transition-colors pr-10"
            value={selectedFeatureIdx}
            onChange={(e) => setSelectedFeatureIdx(Number(e.target.value))}
          >
            {features.map((f, i) => (
              <option key={f.name} value={i}>{f.name} {f.psi > 0.25 ? '⚠️' : ''}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted" />
        </div>

        {/* Chart Area */}
        <div className="flex-1 min-h-[160px] relative flex items-end gap-1 mb-6">
          {/* Legend */}
          <div className="absolute top-0 right-0 flex gap-3 text-[10px] text-muted">
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-ion-blue/40 rounded-sm" /> Ref</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-plasma/60 rounded-sm" /> Curr</div>
          </div>
          
          {selectedFeature.referenceDist.map((refVal, i) => {
            const currVal = selectedFeature.currentDist[i];
            return (
              <div key={i} className="flex-1 relative h-[120px] group">
                <motion.div 
                  className="absolute bottom-0 w-full bg-ion-blue/40 rounded-t-sm"
                  animate={{ height: `${refVal * 100}%` }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                />
                <motion.div 
                  className="absolute bottom-0 w-full bg-plasma/60 rounded-t-sm"
                  animate={{ height: `${currVal * 100}%` }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                />
              </div>
            );
          })}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <StatBox label="PSI" value={selectedFeature.psi.toFixed(3)} threshold={0.2} current={selectedFeature.psi} />
          <StatBox label="KS Stat" value={selectedFeature.ksStat.toFixed(3)} threshold={0.4} current={selectedFeature.ksStat} />
          <StatBox label="p-value" value={selectedFeature.pValue.toExponential(2)} threshold={0.05} current={selectedFeature.pValue} inverse />
          <StatBox label="Wasserstein" value={selectedFeature.wasserstein.toFixed(3)} threshold={0.3} current={selectedFeature.wasserstein} />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, threshold, current, inverse = false }: { label: string, value: string, threshold: number, current: number, inverse?: boolean }) {
  const isBreached = inverse ? current < threshold : current > threshold;
  
  return (
    <div className={cn(
      "p-3 rounded-lg border",
      isBreached ? "bg-crimson/5 border-crimson/20" : "bg-white/5 border-white/5"
    )}>
      <div className="text-[10px] text-muted uppercase mb-1">{label}</div>
      <div className={cn(
        "text-sm font-mono font-bold flex items-center gap-2",
        isBreached ? "text-crimson" : "text-primary"
      )}>
        {value}
        {isBreached && <AlertTriangle className="w-3 h-3" />}
      </div>
    </div>
  );
}
