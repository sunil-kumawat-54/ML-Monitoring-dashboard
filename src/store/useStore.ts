import { create } from "zustand";
import { Scenario, DashboardData, Alert } from "../lib/types";

interface StoreState {
  scenario: Scenario;
  isLive: boolean;
  model: string;
  sidebarOpen: boolean;
  data: DashboardData | null;
  setScenario: (s: Scenario) => void;
  toggleLive: () => void;
  setModel: (m: string) => void;
  toggleSidebar: () => void;
  setData: (data: DashboardData) => void;
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (id: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  scenario: "Moderate",
  isLive: true,
  model: "fraud-detector-v3.2.1",
  sidebarOpen: true,
  data: null,
  setScenario: (scenario) => set({ scenario }),
  toggleLive: () => set((state) => ({ isLive: !state.isLive })),
  setModel: (model) => set({ model }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setData: (data) => set({ data }),
  addAlert: (alert) =>
    set((state) => {
      if (!state.data) return state;
      return {
        data: {
          ...state.data,
          alerts: [alert, ...state.data.alerts].slice(0, 50),
        },
      };
    }),
  acknowledgeAlert: (id) =>
    set((state) => {
      if (!state.data) return state;
      return {
        data: {
          ...state.data,
          alerts: state.data.alerts.map((a) =>
            a.id === id ? { ...a, level: "resolved" } : a
          ),
        },
      };
    }),
}));
