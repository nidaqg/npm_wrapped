import "./styles.css";
import React, { useMemo, useState } from "react";
import { computeWrappedStats, fetchReleases, WrappedStats } from "./npmWrapped";

const currentYear = new Date().getFullYear();

export default function App() {
  const [pkgName, setPkgName] = useState("playbook-ui");
  const [year, setYear] = useState(currentYear);
  const [stats, setStats] = useState<WrappedStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const yearHint = useMemo(() => {
    return year === currentYear
      ? `Showing ${currentYear}. Change year to see past releases.`
      : `Showing ${year}.`;
  }, [year]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = pkgName.trim();
    if (!name) return;

    setLoading(true);
    setError(null);
    setStats(null);

    try {
      const releases = await fetchReleases(name);
      const wrapped = computeWrappedStats(name, releases, year);
      setStats(wrapped);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1 className="title">✨ NPM Wrapped ✨</h1>
          <p className="subtitle">
            Type a package name and get your year in releases!
          </p>
        </div>
      </header>

      <form className="card" onSubmit={handleSubmit}>
        <div className="row">
          <div className="field pkgField">
            <label className="label" htmlFor="pkg">
              Package
            </label>
            <input
              id="pkg"
              className="input"
              value={pkgName}
              onChange={(e) => setPkgName(e.target.value)}
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
              onChange={(e) => setYear(Number(e.target.value) || currentYear)}
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

      {stats && (
        <section className="grid">
          <div className="card">
            <h2 className="sectionTitle">
              {stats.packageName} ( {stats.year} )
            </h2>

            <div className="kpis">
              <div className="kpi">
                <div className="kpiLabel">Total releases</div>
                <div className="kpiValue">{stats.totalReleases}</div>
              </div>
              <div className="kpi">
                <div className="kpiLabel">Stable releases</div>
                <div className="kpiValue">{stats.stableCount}</div>
              </div>
              <div className="kpi">
                <div className="kpiLabel">RCs</div>
                <div className="kpiValue">{stats.rcCount}</div>
              </div>
              <div className="kpi">
                <div className="kpiLabel">Avg RCs / stable</div>
                <div className="kpiValue">{stats.averageRcPerStable}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="sectionTitle">Stable breakdown</h3>
            <div className="kpis">
              <div className="kpi">
                <div className="kpiLabel">Majors</div>
                <div className="kpiValue">{stats.majors}</div>
              </div>
              <div className="kpi">
                <div className="kpiLabel">Minors</div>
                <div className="kpiValue">{stats.minors}</div>
              </div>
              <div className="kpi">
                <div className="kpiLabel">Patches</div>
                <div className="kpiValue">{stats.patches}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="sectionTitle">Monthly highlights</h3>
            <ul className="list">
              <li>
                <span className="listKey">Busiest month (overall)</span>
                <span className="listVal">
                  {stats.busiestMonthOverall ?? "—"}
                </span>
              </li>
              <li>
                <span className="listKey">Most stable releases</span>
                <span className="listVal">
                  {stats.busiestMonthStable ?? "—"}
                </span>
              </li>
              <li>
                <span className="listKey">Patch-iest month</span>
                <span className="listVal">
                  {stats.busiestMonthPatches ?? "—"}
                </span>
              </li>
              <li>
                <span className="listKey">Longest stable gap</span>
                <span className="listVal">
                  {stats.longestGapDays != null
                    ? `${stats.longestGapDays} days`
                    : "—"}
                </span>
              </li>
            </ul>
          </div>

          <div className="card">
            <h3 className="sectionTitle">A little flavor</h3>
            <p className="flavor">
              {stats.rcCount > stats.stableCount
                ? "Your RC era was LOUD this year."
                : stats.patches > stats.minors && stats.patches > stats.majors
                ? "Big ‘ship fixes fast’ energy."
                : stats.majors > 0
                ? "You weren’t afraid of big moves."
                : "Steady and consistent — love that for you."}
            </p>
            <p className="tiny">
              (RCs only count if the version looks like <code>-rc.X</code>)
            </p>
          </div>
        </section>
      )}

      <footer className="footer">
        <span>Built by @nidaqg</span>
      </footer>
    </div>
  );
}
