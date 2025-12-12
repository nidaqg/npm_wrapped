import React from "react";
import { StatsCard } from "./StatsCard";
import { BreakdownCard } from "./BreakdownCard";
import { MonthlyHighlights } from "./MonthlyHighlights";
import { YearComparison } from "./YearComparison";
import { WrappedStats } from "../npmWrapped";

interface StatsGridProps {
  stats: WrappedStats;
  lastYearStats: WrappedStats | null;
}

export function StatsGrid({ stats, lastYearStats }: StatsGridProps) {
  return (
    <section className="grid">
      <StatsCard
        title={`${stats.packageName} — ${stats.year}`}
        stats={stats}
      />
      <BreakdownCard stats={stats} />
      <MonthlyHighlights stats={stats} />
      {lastYearStats && <YearComparison stats={lastYearStats} />}
    </section>
  );
}
