"use client";

import { useStore } from "@/store/useStore";
import { Download, Eye, FileText } from "lucide-react";

export default function ReportsPanel() {
  const { model } = useStore();

  const reports = [
    { id: "REP-9823", date: "2024-10-24 14:00", period: "Last 7 Days", status: "PASS" },
    { id: "REP-9822", date: "2024-10-17 14:00", period: "Last 7 Days", status: "WARN" },
    { id: "REP-9821", date: "2024-10-10 14:00", period: "Last 7 Days", status: "PASS" },
    { id: "REP-9820", date: "2024-10-03 14:00", period: "Last 7 Days", status: "FAIL" },
  ];

  return (
    <div className="bg-card p-6 w-full mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-section-title">Reports & Export History</h3>
        <button className="flex items-center gap-2 bg-gradient-to-r from-ion-blue/20 to-plasma/20 border border-ion-blue/30 text-white px-4 py-2 rounded-lg text-sm hover:border-ion-blue transition-colors">
          <FileText className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] text-muted uppercase tracking-wider border-b border-white/10">
            <tr>
              <th className="py-3 font-normal">Report ID</th>
              <th className="py-3 font-normal">Generated At (UTC)</th>
              <th className="py-3 font-normal">Model Version</th>
              <th className="py-3 font-normal">Period</th>
              <th className="py-3 font-normal">Status</th>
              <th className="py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {reports.map((report, i) => (
              <tr key={report.id} className={i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"}>
                <td className="py-3 text-primary font-mono">{report.id}</td>
                <td className="py-3 text-muted">{report.date}</td>
                <td className="py-3 text-muted">{model}</td>
                <td className="py-3 text-muted">{report.period}</td>
                <td className="py-3">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    report.status === 'PASS' ? 'bg-emerald/10 text-emerald' : 
                    report.status === 'WARN' ? 'bg-amber/10 text-amber' : 
                    'bg-crimson/10 text-crimson'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="py-3 flex items-center justify-end gap-3 text-muted">
                  <button className="hover:text-ion-blue transition-colors flex items-center gap-1 text-xs">
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  <button className="hover:text-primary transition-colors flex items-center gap-1 text-xs">
                    <Download className="w-3.5 h-3.5" /> JSON
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
