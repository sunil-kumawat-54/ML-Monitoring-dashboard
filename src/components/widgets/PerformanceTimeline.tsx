"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { cn } from "@/lib/utils";

type Tab = "accuracy" | "aucRoc" | "f1Score" | "precision" | "recall" | "logLoss";

export default function PerformanceTimeline() {
  const { data } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>("accuracy");

  if (!data) return null;

  const tabs: { id: Tab; label: string; thresholdWarning: number; thresholdCritical: number; baseline: number; inverse?: boolean }[] = [
    { id: "accuracy", label: "Accuracy", thresholdWarning: 93, thresholdCritical: 90, baseline: 95.5 },
    { id: "aucRoc", label: "AUC-ROC", thresholdWarning: 0.94, thresholdCritical: 0.90, baseline: 0.96 },
    { id: "f1Score", label: "F1 Score", thresholdWarning: 0.90, thresholdCritical: 0.85, baseline: 0.93 },
    { id: "precision", label: "Precision", thresholdWarning: 0.92, thresholdCritical: 0.88, baseline: 0.94 },
    { id: "recall", label: "Recall", thresholdWarning: 0.90, thresholdCritical: 0.85, baseline: 0.92 },
    { id: "logLoss", label: "Log Loss", thresholdWarning: 0.20, thresholdCritical: 0.25, baseline: 0.15, inverse: true },
  ];

  const currentTab = tabs.find(t => t.id === activeTab)!;

  const formatValue = (val: number) => {
    return activeTab === "accuracy" ? val.toFixed(1) + "%" : val.toFixed(3);
  };

  const chartData = data.timeline.map((pt, i) => ({
    name: `Day ${i + 1}`,
    value: pt[activeTab]
  }));

  const currentVal = chartData[chartData.length - 1].value;
  const isBreachedWarning = currentTab.inverse ? currentVal > currentTab.thresholdWarning : currentVal < currentTab.thresholdWarning;
  const isBreachedCritical = currentTab.inverse ? currentVal > currentTab.thresholdCritical : currentVal < currentTab.thresholdCritical;

  const statusColor = isBreachedCritical ? "text-crimson" : isBreachedWarning ? "text-amber" : "text-emerald";

  return (
    <div className="bg-card p-6 flex flex-col w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h3 className="text-section-title">Model Performance Timeline</h3>
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs transition-colors border",
                activeTab === tab.id 
                  ? "bg-ion-blue/20 text-white border-ion-blue/50" 
                  : "bg-transparent text-muted border-white/5 hover:border-white/20 hover:text-primary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#4b5a7a" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#4b5a7a" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={formatValue} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#0b0f1e', borderColor: 'rgba(120,180,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff', fontFamily: 'var(--font-mono)' }}
                labelStyle={{ color: '#4b5a7a', marginBottom: '4px', fontSize: '12px' }}
                formatter={(val: any) => [formatValue(Number(val)), currentTab.label]}
              />
              <ReferenceLine y={currentTab.baseline} stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" />
              <ReferenceLine y={currentTab.thresholdWarning} stroke="#f59e0b" strokeDasharray="3 3" />
              <ReferenceLine y={currentTab.thresholdCritical} stroke="#ef4444" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3d9bff" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 6, fill: "#3d9bff", stroke: "#0b0f1e", strokeWidth: 2 }}
                animationDuration={1200}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/5">
            <div className="text-xs text-muted mb-2">Current {currentTab.label}</div>
            <div className={cn("text-3xl font-mono font-bold", statusColor)}>
              {formatValue(currentVal)}
            </div>
            <div className="text-xs text-muted mt-2 flex justify-between">
              <span>vs Baseline</span>
              <span className={isBreachedWarning ? "text-amber" : "text-emerald"}>
                {currentVal > currentTab.baseline ? "+" : ""}{formatValue(currentVal - currentTab.baseline)}
              </span>
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex-1">
            <div className="text-xs text-muted mb-4 uppercase tracking-wider">30-Day Summary</div>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted">Max</span>
                <span className="text-white">{formatValue(Math.max(...chartData.map(d => d.value)))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Min</span>
                <span className="text-white">{formatValue(Math.min(...chartData.map(d => d.value)))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Avg</span>
                <span className="text-white">{formatValue(chartData.reduce((a, b) => a + b.value, 0) / chartData.length)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
