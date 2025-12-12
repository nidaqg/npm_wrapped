import React from "react";
import { KpiDisplay } from "./KpiDisplay";
import { WrappedStats } from "../npmWrapped";

interface BreakdownCardProps {
  stats: WrappedStats;
}

export function BreakdownCard({ stats }: BreakdownCardProps) {
  return (
    <div className="card">
      <h3 className="sectionTitle">Stable breakdown</h3>
      <div className="kpis">
        <KpiDisplay label="Majors" value={stats.majors} />
        <KpiDisplay label="Minors" value={stats.minors} />
        <KpiDisplay label="Patches" value={stats.patches} />
      </div>
    </div>
  );
}
