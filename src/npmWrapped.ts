import semver from "semver";
import dayjs from "dayjs";

export type ReleaseType = "major" | "minor" | "patch";

export interface Release {
  version: string;
  baseVersion: string;
  type: ReleaseType;
  isStable: boolean;
  isRc: boolean;
  date: string;
  year: number;
  month: string; 
}

export interface WrappedStats {
  year: number;
  packageName: string;

  totalReleases: number;
  stableCount: number;
  rcCount: number;

  majors: number;
  minors: number;
  patches: number;

  busiestMonthOverall?: string;
  busiestMonthStable?: string; 
  busiestMonthPatches?: string;

  averageRcPerStable: number;

  longestGapDays?: number;
}

/**
 * Only count:
 * - stable releases
 * - RC prereleases
 */
function isTrackedRelease(r: Release): boolean {
  return r.isStable || r.isRc;
}

function classifyType(baseVersion: string): ReleaseType {
  const parsed = semver.parse(baseVersion);
  if (!parsed) return "patch";

  const { minor, patch } = parsed;
  if (minor === 0 && patch === 0) return "major";
  if (patch === 0) return "minor";
  return "patch";
}

function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ||= []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Converts "YYYY-MM" to "Month"
 */
function monthKeyToName(monthKey: string): string {
  return dayjs(`${monthKey}-01`).format("MMMM");
}

function findBusiestMonth(grouped: Record<string, Release[]>): string | undefined {
  let bestKey: string | undefined;
  let max = 0;

  for (const [monthKey, list] of Object.entries(grouped)) {
    if (list.length > max) {
      max = list.length;
      bestKey = monthKey;
    }
  }

  return bestKey ? monthKeyToName(bestKey) : undefined;
}

export async function fetchReleases(pkgName: string): Promise<Release[]> {
  const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkgName)}`);

  if (!res.ok) {
    if (res.status === 404) throw new Error(`Package not found: "${pkgName}"`);
    throw new Error(`Failed to fetch "${pkgName}" (HTTP ${res.status})`);
  }

  const data = await res.json();
  const time: Record<string, string> = data.time || {};
  const versions: string[] = Object.keys(data.versions || {});

  const releases: Release[] = [];

  for (const version of versions) {
    const publishedAt = time[version];
    if (!publishedAt) continue;

    const parsed = semver.parse(version);
    if (!parsed) continue;

    const baseVersion = `${parsed.major}.${parsed.minor}.${parsed.patch}`;
    const isStable = parsed.prerelease.length === 0;
    const isRc =
      parsed.prerelease.length > 0 &&
      String(parsed.prerelease[0]).toLowerCase() === "rc";

    const date = dayjs(publishedAt);
    if (!date.isValid()) continue;

    releases.push({
      version,
      baseVersion,
      type: classifyType(baseVersion),
      isStable,
      isRc,
      date: date.toISOString(),
      year: date.year(),
      month: date.format("YYYY-MM"),
    });
  }

  return releases;
}

export function computeWrappedStats(
  pkgName: string,
  releases: Release[],
  year: number
): WrappedStats {
  const trackedReleases = releases.filter(
    (r) => r.year === year && isTrackedRelease(r)
  );

  const stable = trackedReleases.filter((r) => r.isStable);
  const rcs = trackedReleases.filter((r) => r.isRc);

  const majors = stable.filter((r) => r.type === "major").length;
  const minors = stable.filter((r) => r.type === "minor").length;
  const patches = stable.filter((r) => r.type === "patch").length;

  const busiestMonthOverall = findBusiestMonth(
    groupBy(trackedReleases, (r) => r.month)
  );
  const busiestMonthStable = findBusiestMonth(
    groupBy(stable, (r) => r.month)
  );
  const busiestMonthPatches = findBusiestMonth(
    groupBy(
      stable.filter((r) => r.type === "patch"),
      (r) => r.month
    )
  );

  // Average RCs per stable release
  const rcCountByBase = new Map<string, number>();
  for (const rc of rcs) {
    rcCountByBase.set(
      rc.baseVersion,
      (rcCountByBase.get(rc.baseVersion) || 0) + 1
    );
  }

  let totalRcForStable = 0;
  for (const s of stable) {
    totalRcForStable += rcCountByBase.get(s.baseVersion) || 0;
  }

  const averageRcPerStable =
    stable.length === 0
      ? 0
      : Number((totalRcForStable / stable.length).toFixed(2));

  // Longest gap between stable releases
  let longestGapDays: number | undefined;
  if (stable.length > 1) {
    const sorted = [...stable].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    for (let i = 1; i < sorted.length; i++) {
      const diff = dayjs(sorted[i].date).diff(dayjs(sorted[i - 1].date), "day");
      longestGapDays =
        longestGapDays == null ? diff : Math.max(longestGapDays, diff);
    }
  }

  return {
    year,
    packageName: pkgName,
    totalReleases: trackedReleases.length,
    stableCount: stable.length,
    rcCount: rcs.length,
    majors,
    minors,
    patches,
    busiestMonthOverall,
    busiestMonthStable,
    busiestMonthPatches,
    averageRcPerStable,
    longestGapDays,
  };
}
