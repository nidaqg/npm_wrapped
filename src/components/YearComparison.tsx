import React from "react";
import { WrappedStats } from "../npmWrapped";

interface ListItemProps {
  label: string;
  value: string | number | null | undefined;
}

function ListItem({ label, value }: ListItemProps) {
  return (
    <li>
      <span className="listKey">{label}</span>
      <span className="listVal">{value ?? "—"}</span>
    </li>
  );
}

interface YearComparisonProps {
  stats: WrappedStats;
}

export function YearComparison({ stats }: YearComparisonProps) {
  return (
    <div className="card">
      <h3 className="sectionTitle">Last year ({stats.year})</h3>

      <ul className="list">
        <ListItem label="Total releases" value={stats.totalReleases} />
        <ListItem label="Stable releases" value={stats.stableCount} />
        <ListItem label="RCs" value={stats.rcCount} />
        <ListItem
          label="Majors / Minors / Patches"
          value={`${stats.majors}/${stats.minors}/${stats.patches}`}
        />
      </ul>
    </div>
  );
}
