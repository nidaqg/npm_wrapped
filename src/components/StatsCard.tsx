import React from "react";
import { KpiDisplay } from "./KpiDisplay";
import { WrappedStats } from "../npmWrapped";

interface StatsCardProps {
  title: string;
  stats: WrappedStats;
}

export function StatsCard({ title, stats }: StatsCardProps) {
  return (
    <div className="card">
      <h2 className="sectionTitle">{title}</h2>

      <div className="kpis">
        <KpiDisplay label="Total releases" value={stats.totalReleases} />
        <KpiDisplay label="Stable releases" value={stats.stableCount} />
        <KpiDisplay label="RCs" value={stats.rcCount} />
        <KpiDisplay label="Avg RCs / stable" value={stats.averageRcPerStable} />
      </div>
    </div>
  );
}
