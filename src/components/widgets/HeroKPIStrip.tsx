"use client";

import { useStore } from "@/store/useStore";
import { motion, Variants } from "framer-motion";
import { ArrowDown, ArrowUp, Activity } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function HeroKPIStrip() {
  const { data } = useStore();
  
  if (!data) return null;

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const activeAlertsCount = data.alerts.filter(a => a.level !== "resolved").length;
  const criticalCount = data.alerts.filter(a => a.level === "critical").length;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full"
    >
      {/* 1. Health Score */}
      <motion.div variants={item} className="bg-card p-5 group hover:-translate-y-1.5 transition-all duration-350 hover:shadow-[0_20px_60px_rgba(61,155,255,0.12)] relative overflow-hidden flex flex-col justify-between">
        <div>
          <h3 className="text-section-title mb-4">Overall Health Score</h3>
          <div className="flex items-center gap-4">
            <HealthRing score={data.healthScore} />
            <div className="flex flex-col">
              <span className="text-kpi text-emerald leading-none">{data.healthScore}</span>
              <span className="text-[10px] text-muted mt-1 uppercase">/ 100</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted mt-4 truncate">
          {data.healthScore > 90 ? "No Critical Drift Detected" : "Attention Required"}
        </p>
      </motion.div>

      {/* 2. Data Drift Score */}
      <motion.div variants={item} className="bg-card p-5 group hover:-translate-y-1.5 transition-all duration-350 hover:shadow-[0_20px_60px_rgba(61,155,255,0.12)] flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <h3 className="text-section-title">Data Drift (PSI)</h3>
          <span className={cn(
            "text-badge px-2 py-0.5",
            data.overallPsi < 0.1 ? "bg-emerald/10 text-emerald" : data.overallPsi < 0.2 ? "bg-amber/10 text-amber" : "bg-crimson/10 text-crimson"
          )}>
            {data.overallPsi < 0.1 ? "LOW DRIFT" : data.overallPsi < 0.2 ? "WARNING" : "CRITICAL"}
          </span>
        </div>
        <div>
          <div className="text-kpi mt-2 text-white">{data.overallPsi.toFixed(3)}</div>
          <div className="h-[24px] mt-2 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data.features[0]?.history.map((val, i) => ({ i, val })) || []}>
                 <Area type="monotone" dataKey="val" stroke="#3d9bff" fill="rgba(61,155,255,0.1)" strokeWidth={1.5} />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* 3. Model Accuracy */}
      <motion.div variants={item} className="bg-card p-5 group hover:-translate-y-1.5 transition-all duration-350 hover:shadow-[0_20px_60px_rgba(61,155,255,0.12)] flex flex-col justify-between">
        <h3 className="text-section-title">Model Accuracy</h3>
        <div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-kpi text-white">{data.accuracy.current.toFixed(1)}%</span>
            <span className={cn("flex items-center text-xs font-mono font-semibold", data.accuracy.delta >= 0 ? "text-emerald" : "text-crimson")}>
              {data.accuracy.delta >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {Math.abs(data.accuracy.delta).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-end gap-1 h-[24px] mt-2">
            {data.accuracy.history.map((val, i) => (
              <div key={i} className="flex-1 bg-plasma rounded-t-sm" style={{ height: `${Math.max(10, (val / 100) * 100)}%`, opacity: i === 6 ? 1 : 0.4 }} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* 4. Prediction Volume */}
      <motion.div variants={item} className="bg-card p-5 group hover:-translate-y-1.5 transition-all duration-350 hover:shadow-[0_20px_60px_rgba(61,155,255,0.12)] flex flex-col justify-between relative overflow-hidden">
        <h3 className="text-section-title">Prediction Volume (24h)</h3>
        <div className="z-10 relative">
          <AnimatedCount value={data.predictionVolume.count} className="text-kpi text-white mt-2 block" />
          <div className="text-xs text-muted font-mono mt-1 flex items-center gap-1">
            <Activity className="w-3 h-3 text-ion-blue" />
            {data.predictionVolume.throughput.toFixed(1)}k / hr
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.predictionVolume.history.map((v, i) => ({ i, v }))}>
              <Area type="step" dataKey="v" stroke="#3d9bff" fill="#3d9bff" strokeWidth={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 5. Active Alerts */}
      <motion.div variants={item} className="bg-card p-5 group hover:-translate-y-1.5 transition-all duration-350 hover:shadow-[0_20px_60px_rgba(61,155,255,0.12)] flex flex-col justify-between">
        <h3 className="text-section-title">Active Alerts</h3>
        <div className="flex justify-between items-end mt-2">
          <div>
            <div className={cn("text-kpi leading-none", activeAlertsCount > 0 ? "text-amber" : "text-emerald")}>
              {activeAlertsCount}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {criticalCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-muted uppercase">
                  <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" /> {criticalCount} Crit
                </span>
              )}
              {activeAlertsCount - criticalCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-muted uppercase">
                  <span className="w-2 h-2 rounded-full bg-amber" /> {activeAlertsCount - criticalCount} Warn
                </span>
              )}
              {activeAlertsCount === 0 && (
                <span className="flex items-center gap-1 text-[10px] text-muted uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald" /> All Clear
                </span>
              )}
            </div>
          </div>
          <button className="text-xs text-ion-blue hover:text-white transition-colors bg-ion-blue/10 px-3 py-1.5 rounded-full border border-ion-blue/20 hover:border-ion-blue">
            View All
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HealthRing({ score }: { score: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const color = score > 90 ? "#10b981" : score > 70 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-[56px] h-[56px] flex items-center justify-center shrink-0">
      <svg className="transform -rotate-90 w-full h-full">
        <circle cx="28" cy="28" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
        <motion.circle 
          cx="28" cy="28" r={radius} 
          stroke={color} 
          strokeWidth="4" 
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
    </div>
  );
}

function AnimatedCount({ value, className }: { value: number, className: string }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;
    
    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(start + (end - start) * ease);
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return <span className={className}>{displayValue.toLocaleString()}</span>;
}
