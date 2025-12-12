import React from "react";

interface KpiDisplayProps {
  label: string;
  value: string | number;
}

export function KpiDisplay({ label, value }: KpiDisplayProps) {
  return (
    <div className="kpi">
      <div className="kpiLabel">{label}</div>
      <div className="kpiValue">{value}</div>
    </div>
  );
}
