import "server-only";
import { cacheLife } from "next/cache";
import { DAYS, computeStreak, longestStreak, seededLevels, toLevels, type Day } from "./contributions";

const USER = "Umex10";
const API = "https://api.github.com";

export type GitHubData = {
  /** 364 levels (0…10), oldest first */
  levels: number[];
  streak: number;
  longest: number;
  total: number | null;
  repos: number;
  languages: string[];
  run: { number: number; status: "passed" | "failed" | "running"; total: string } | null;
  live: { calendar: boolean; repos: boolean };
};

const FALLBACK: GitHubData = {
  levels: seededLevels(),
  streak: 250,
  longest: 250,
  total: null,
  repos: 20,
  languages: ["TypeScript", "Java"],
  run: null,
  live: { calendar: false, repos: false },
};

function headers(): HeadersInit {
  const h: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "dev-resume" };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function getJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, { ...init, headers: { ...headers(), ...init?.headers }, signal: AbortSignal.timeout(8000) });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

type CalendarResponse = {
  data?: { user?: { contributionsCollection: { contributionCalendar: { totalContributions: number; weeks: { contributionDays: { date: string; contributionCount: number }[] }[] } } } };
};

async function calendar(): Promise<{ days: Day[]; total: number } | null> {
  if (!process.env.GITHUB_TOKEN) return null; // GraphQL requires auth
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}`;
  const json = await getJson<CalendarResponse>(`${API}/graphql`, {
    method: "POST",
    body: JSON.stringify({ query, variables: { login: USER } }),
  });
  const cal = json?.data?.user?.contributionsCollection.contributionCalendar;
  if (!cal) return null;
  const days = cal.weeks.flatMap((w) => w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })));
  return { days, total: cal.totalContributions };
}

type Repo = { language: string | null; fork: boolean };

async function repos(): Promise<{ count: number; languages: string[] } | null> {
  const [user, list] = await Promise.all([
    getJson<{ public_repos: number }>(`${API}/users/${USER}`),
    getJson<Repo[]>(`${API}/users/${USER}/repos?per_page=100&type=owner`),
  ]);
  if (!user) return null;
  const tally = new Map<string, number>();
  for (const r of list ?? []) if (r.language && !r.fork) tally.set(r.language, (tally.get(r.language) ?? 0) + 1);
  const languages = [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([l]) => l);
  return { count: user.public_repos, languages: languages.length ? languages : FALLBACK.languages };
}

type RunsResponse = {
  workflow_runs: { run_number: number; status: string; conclusion: string | null; run_started_at: string; updated_at: string }[];
};

export function formatDuration(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;
}

async function latestRun(): Promise<GitHubData["run"]> {
  const json = await getJson<RunsResponse>(`${API}/repos/${USER}/authkit/actions/runs?branch=main&per_page=1`);
  const r = json?.workflow_runs[0];
  if (!r) return null;
  const status = r.status !== "completed" ? "running" : r.conclusion === "success" ? "passed" : "failed";
  return { number: r.run_number, status, total: formatDuration(Date.parse(r.updated_at) - Date.parse(r.run_started_at)) };
}

/** Everything the status, shell, work and ship sections need. Cached for an hour. */
export async function getGitHubData(): Promise<GitHubData> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 86400 });

  const [cal, rep, run] = await Promise.all([calendar(), repos(), latestRun()]);
  const days = cal?.days.slice(-DAYS);
  return {
    levels: days && days.length === DAYS ? toLevels(days.map((d) => d.count)) : FALLBACK.levels,
    streak: days ? computeStreak(days) : FALLBACK.streak,
    longest: cal ? longestStreak(cal.days) : FALLBACK.longest,
    total: cal?.total ?? null,
    repos: rep?.count ?? FALLBACK.repos,
    languages: rep?.languages ?? FALLBACK.languages,
    run,
    live: { calendar: !!cal, repos: !!rep },
  };
}
