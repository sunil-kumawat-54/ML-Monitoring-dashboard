"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/lib/AuthContext";
import { Scenario } from "@/lib/types";
import { Hexagon, ChevronDown, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TopBar() {
  const { isLive, toggleLive, model, scenario, setScenario } = useStore();
  const { user, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const links = ["Overview", "Drift", "Performance", "Features", "Reports", "Alerts"];

  return (
    <header className="h-[64px] shrink-0 bg-[#07090f]/85 backdrop-blur-[20px] border-b border-white/5 flex items-center justify-between px-6 z-20 relative">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <Hexagon className="w-8 h-8 text-ion-blue" strokeWidth={1.5} />
          <span className="absolute text-[10px] font-bold text-ion-blue shadow-[0_0_10px_rgba(61,155,255,0.8)]">M</span>
        </div>
        <span className="font-bold text-base tracking-wide">ML.Monitor</span>
      </div>

      {/* Center: Links */}
      <nav className="hidden md:flex items-center h-full">
        {links.map((link, i) => {
          const isActive = i === 0;
          return (
            <button
              key={link}
              className={cn(
                "h-full px-5 text-sm transition-all duration-300 relative group flex items-center",
                isActive ? "text-white" : "text-muted hover:text-white hover:-translate-y-[1px]"
              )}
            >
              {link}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-ion-blue shadow-[0_-2px_10px_rgba(61,155,255,0.5)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right: Controls */}
      <div className="flex items-center gap-6">
        {/* Scenario Switcher */}
        <div className="relative group">
          <select 
            className="appearance-none bg-surface border border-ion-blue/20 rounded-full px-4 py-1.5 text-xs font-mono text-primary outline-none cursor-pointer hover:border-ion-blue/50 transition-colors pl-4 pr-8"
            value={scenario}
            onChange={(e) => setScenario(e.target.value as Scenario)}
          >
            <option value="Healthy">🟢 Healthy</option>
            <option value="Moderate">🟡 Moderate Drift</option>
            <option value="Severe">🔴 Severe Degradation</option>
          </select>
          <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted" />
        </div>

        {/* Live Toggle */}
        <button 
          onClick={toggleLive}
          className="flex items-center gap-2 group"
        >
          <span className={cn(
            "w-2 h-2 rounded-full transition-all duration-500",
            isLive ? "bg-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" : "bg-muted"
          )} />
          <span className="text-[10px] font-mono tracking-wider uppercase text-muted group-hover:text-primary transition-colors">
            {isLive ? "Live" : "Paused"}
          </span>
        </button>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center relative hover:border-ion-blue transition-colors"
          >
            <User className="w-4 h-4 text-muted" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald border-[2px] border-[#07090f] rounded-full" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-12 w-64 bg-surface-elevated border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-xs text-muted">Signed in as</p>
                <p className="text-sm text-primary font-medium truncate">{user?.email}</p>
              </div>
              <button
                onClick={signOut}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-crimson hover:bg-crimson/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
