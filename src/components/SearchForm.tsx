import React, { useMemo } from "react";

interface SearchFormProps {
  pkgName: string;
  year: number;
  currentYear: number;
  loading: boolean;
  error: string | null;
  onPackageChange: (value: string) => void;
  onYearChange: (value: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SearchForm({
  pkgName,
  year,
  currentYear,
  loading,
  error,
  onPackageChange,
  onYearChange,
  onSubmit,
}: SearchFormProps) {
  const yearHint = useMemo(() => {
    return year === currentYear ? `Showing ${currentYear}.` : `Showing ${year}.`;
  }, [year, currentYear]);

  return (
    <form className="card" onSubmit={onSubmit}>
      <div className="row">
        <div className="field pkgField">
          <label className="label" htmlFor="pkg">
            Package
          </label>
          <input
            id="pkg"
            className="input"
            value={pkgName}
            onChange={(e) => onPackageChange(e.target.value)}
            placeholder="e.g. playbook-ui"
            autoComplete="off"
          />
          <div className="hint">
            Examples: react, lodash, next, playbook-ui
          </div>
        </div>

        <div className="field yearField">
          <label className="label" htmlFor="year">
            Year
          </label>
          <input
            id="year"
            className="input"
            type="number"
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value) || currentYear)}
            min={2000}
            max={currentYear}
          />
          <div className="hint">{yearHint}</div>
        </div>
      </div>

      <div className="actions">
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Crunching…" : "Show Wrapped"}
        </button>
      </div>

      {error && <div className="error">⚠️ {error}</div>}
    </form>
  );
}
