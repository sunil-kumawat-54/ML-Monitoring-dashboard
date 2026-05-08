"use client";

import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FeatureImportanceShift() {
  const { data } = useStore();

  if (!data) return null;

  return (
    <div className="bg-card p-6 w-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-section-title">Feature Importance Drift</h3>
        <div className="flex gap-4 text-[10px] text-muted">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-ion-blue rounded-[2px]" /> Reference</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-plasma rounded-[2px]" /> Current</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {data.importance.slice(0, 10).map((feat, i) => (
          <div key={feat.name} className="flex items-center gap-4 group">
            <div className="w-[140px] shrink-0 text-xs text-muted group-hover:text-primary transition-colors truncate text-right">
              {feat.name}
            </div>
            
            <div className="flex-1 relative h-[24px]">
              {/* Reference Bar */}
              <motion.div 
                className="absolute top-0 left-0 h-[10px] bg-ion-blue rounded-r-sm origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                style={{ width: `${feat.reference * 300}%` }}
              />
              {/* Current Bar */}
              <motion.div 
                className="absolute bottom-0 left-0 h-[10px] bg-plasma rounded-r-sm origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: i * 0.05 + 0.1, ease: "easeOut" }}
                style={{ width: `${feat.current * 300}%` }}
              />
            </div>

            <div className="w-[80px] shrink-0 flex items-center justify-end gap-2 text-xs font-mono">
              <span className="text-muted">{(feat.delta * 100).toFixed(1)}%</span>
              {feat.direction === "up" ? (
                <ArrowUp className="w-3 h-3 text-emerald" />
              ) : (
                <ArrowDown className="w-3 h-3 text-crimson" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
