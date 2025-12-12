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

interface MonthlyHighlightsProps {
  stats: WrappedStats;
}

export function MonthlyHighlights({ stats }: MonthlyHighlightsProps) {
  return (
    <div className="card">
      <h3 className="sectionTitle">Monthly highlights</h3>
      <ul className="list">
        <ListItem label="Busiest month" value={stats.busiestMonthOverall} />
        <ListItem label="Most stable releases" value={stats.busiestMonthStable} />
        <ListItem label="Patch-iest month" value={stats.busiestMonthPatches} />
      </ul>
    </div>
  );
}
