"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

export default function Footer() {
  const { isLive, model } = useStore();
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTime(d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="h-[32px] shrink-0 bg-[#04060f]/95 border-t border-white/5 flex items-center justify-between px-4 text-[11px] font-mono text-muted z-20 relative">
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.6)]' : 'bg-muted'}`} />
        <span className="hover:text-primary transition-colors cursor-default">
          {isLive ? "SIMULATION ACTIVE" : "SIMULATION PAUSED"}
        </span>
      </div>

      <div className="flex items-center gap-4 text-center">
        <span className="hover:text-primary transition-colors cursor-default">Last sync: {isLive ? "5s ago" : "Paused"}</span>
        <span className="text-white/20">|</span>
        <span className="hover:text-primary transition-colors cursor-default">Latency: 12ms</span>
        <span className="text-white/20">|</span>
        <span className="hover:text-primary transition-colors cursor-default text-ion-blue/80">Model: {model}</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="hover:text-primary transition-colors cursor-default">{time}</span>
        <span className="text-white/20">|</span>
        <span className="hover:text-primary transition-colors cursor-default">Powered by Antigravity</span>
      </div>
    </footer>
  );
}
