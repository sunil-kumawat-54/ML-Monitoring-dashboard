"use client";

import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Activity, 
  TrendingUp, 
  BarChart2, 
  Crosshair, 
  BellRing, 
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, model } = useStore();

  const navItems = [
    { label: "Dashboard Overview", icon: LayoutDashboard, active: true },
    { 
      label: "Data Drift", 
      icon: Activity,
      children: ["Feature Drift Map", "PSI Analysis", "KL Divergence"]
    },
    { 
      label: "Model Performance", 
      icon: TrendingUp,
      children: ["Accuracy Trends", "AUC / PR Curves", "Confusion Matrix"]
    },
    { label: "Prediction Drift", icon: BarChart2 },
    { label: "Feature Importance", icon: Crosshair },
    { label: "Alerts & Thresholds", icon: BellRing },
    { label: "Reports", icon: FileText },
  ];

  return (
    <aside 
      className={cn(
        "bg-[#07090f] border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out shrink-0 z-10",
        sidebarOpen ? "w-[240px]" : "w-[64px]"
      )}
    >
      {/* Model Info */}
      <div className={cn("p-4 border-b border-white/5 whitespace-nowrap overflow-hidden transition-opacity", !sidebarOpen && "opacity-0 invisible h-[64px] p-0")}>
        <div className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Active Model</div>
        <div className="text-sm font-semibold truncate text-ion-blue">{model}</div>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] text-muted uppercase tracking-wider">Online</span>
        </div>
      </div>

      {/* Nav Tree */}
      <nav className="flex-1 overflow-y-auto py-4 overflow-x-hidden">
        {navItems.map((item, i) => (
          <div key={i} className="mb-1">
            <button
              className={cn(
                "w-full flex items-center px-4 py-2 text-sm text-left transition-colors group",
                item.active 
                  ? "bg-ion-blue/10 border-l-2 border-ion-blue text-white" 
                  : "text-muted hover:text-white hover:bg-white/5 border-l-2 border-transparent"
              )}
            >
              <item.icon className={cn("w-4 h-4 shrink-0", item.active ? "text-ion-blue" : "text-muted group-hover:text-white", sidebarOpen ? "mr-3" : "mx-auto")} />
              {sidebarOpen && <span className="truncate font-medium">{item.label}</span>}
            </button>
            {sidebarOpen && item.children && (
              <div className="pl-11 pr-4 py-1 flex flex-col gap-2">
                {item.children.map((child, j) => (
                  <button key={j} className="text-xs text-muted hover:text-white text-left transition-colors">
                    {child}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Toggle */}
      <button 
        onClick={toggleSidebar}
        className="p-4 border-t border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors text-muted hover:text-white"
      >
        {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
    </aside>
  );
}
