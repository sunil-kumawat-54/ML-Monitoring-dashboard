"use client";

import { useStore } from "@/store/useStore";
import { useAuth } from "@/lib/AuthContext";
import { acknowledgeAlertInDb } from "@/lib/supabase-data";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

export default function AlertFeed() {
  const { data, acknowledgeAlert } = useStore();
  const { user } = useAuth();

  const handleAcknowledge = (id: string) => {
    acknowledgeAlert(id);
    if (user) acknowledgeAlertInDb(id);
  };

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      {/* Alert Feed (8 col) */}
      <div className="lg:col-span-8 bg-card p-6 flex flex-col h-[400px]">
        <h3 className="text-section-title mb-6 shrink-0">Alert Feed</h3>
        <div className="flex-1 overflow-y-auto pr-4 space-y-4 relative">
          <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-ion-blue/15" />
          
          <AnimatePresence>
            {data.alerts.map((alert) => (
              <motion.div 
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "relative pl-8 group",
                  alert.level === "resolved" && "opacity-50"
                )}
              >
                {/* Dot */}
                <div className={cn(
                  "absolute left-0 top-1.5 w-5 h-5 rounded-full flex items-center justify-center border-[3px] border-[#0b0f1e] z-10",
                  alert.level === "critical" ? "bg-crimson" : alert.level === "warning" ? "bg-amber" : "bg-emerald"
                )}>
                  {alert.level === "critical" && <span className="absolute w-full h-full rounded-full bg-crimson animate-pulse opacity-50" />}
                </div>

                <div className={cn(
                  "bg-white/5 border rounded-lg p-3 transition-colors",
                  alert.level === "critical" && "border-crimson/30 bg-crimson/5",
                  alert.level === "warning" && "border-amber/30 bg-amber/5",
                  alert.level === "resolved" && "border-white/5"
                )}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-[10px] font-mono text-ion-blue uppercase tracking-wider">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                    {alert.level !== "resolved" && (
                      <button 
                        onClick={() => handleAcknowledge(alert.id)}
                        className="text-[10px] text-muted hover:text-white px-2 py-0.5 rounded border border-white/10 hover:border-ion-blue transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                  <div className="text-[13px] font-semibold text-white mb-1 flex items-center gap-2">
                    {alert.level === "critical" && <AlertCircle className="w-3.5 h-3.5 text-crimson" />}
                    {alert.level === "warning" && <AlertTriangle className="w-3.5 h-3.5 text-amber" />}
                    {alert.level === "resolved" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald" />}
                    {alert.title}
                  </div>
                  <div className="text-[11px] text-muted">
                    {alert.detail}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {data.alerts.length === 0 && (
            <div className="text-sm text-muted text-center py-10 italic">No alerts in the current period.</div>
          )}
        </div>
      </div>

      {/* Threshold Config (4 col) */}
      <div className="lg:col-span-4 bg-card p-6 flex flex-col h-[400px]">
        <h3 className="text-section-title mb-6 shrink-0">Threshold Configuration</h3>
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white">Data Drift PSI</span>
                <span className="text-muted font-mono">Crit: &gt;0.25</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald" style={{ width: '40%' }} />
                <div className="h-full bg-amber" style={{ width: '60%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white">Accuracy Drop</span>
                <span className="text-muted font-mono">Warn: -2%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full relative">
                <div className="absolute left-0 top-0 h-full bg-ion-blue rounded-full" style={{ width: '70%' }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(61,155,255,0.8)]" style={{ left: '70%' }} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white">Prediction Volume</span>
                <span className="text-muted font-mono">±20%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full relative">
                <div className="absolute left-[20%] top-0 h-full bg-ion-blue/50 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>

        <button className="w-full mt-4 py-2.5 rounded-lg bg-gradient-to-r from-ion-blue/80 to-plasma/80 text-white text-sm font-medium hover:opacity-90 transition-opacity border border-white/10 shadow-[0_0_20px_rgba(61,155,255,0.2)]">
          Save Configuration
        </button>
      </div>
    </div>
  );
}
