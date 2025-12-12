import "./styles.css";
import React, { useState } from "react";
import { computeWrappedStats, fetchReleases, WrappedStats } from "./npmWrapped";
import {
  SearchForm,
  StatsGrid,
  Header,
  Footer,
} from "./components";

const currentYear = new Date().getFullYear();

export default function App() {
  const [pkgName, setPkgName] = useState("playbook-ui");
  const [year, setYear] = useState(currentYear);
  const [stats, setStats] = useState<WrappedStats | null>(null);
  const [lastYearStats, setLastYearStats] = useState<WrappedStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = pkgName.trim();
    if (!name) return;

    setLoading(true);
    setError(null);
    setStats(null);
    setLastYearStats(null);

    try {
      const releases = await fetchReleases(name);

      const current = computeWrappedStats(name, releases, year);
      const previous = computeWrappedStats(name, releases, year - 1);

      setStats(current);
      setLastYearStats(previous);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <Header />

      <SearchForm
        pkgName={pkgName}
        year={year}
        currentYear={currentYear}
        loading={loading}
        error={error}
        onPackageChange={setPkgName}
        onYearChange={setYear}
        onSubmit={handleSubmit}
      />

      {stats && <StatsGrid stats={stats} lastYearStats={lastYearStats} />}

      <Footer />
    </div>
  );
}
