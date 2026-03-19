import type {
  Hackathon,
  HackathonDetail,
  Team,
  Submission,
  LeaderboardData,
  UserProfile,
} from "@/lib/types";

const STORAGE_KEYS = {
  HACKATHONS: "hackathons",
  HACKATHON_DETAILS: "hackathonDetails",
  TEAMS: "teams",
  SUBMISSIONS: "submissions",
  LEADERBOARDS: "leaderboards",
  USER_PROFILE: "userProfile",
} as const;

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------------------------------------------------------------------------
// Hackathons
// ---------------------------------------------------------------------------

export function getHackathons(): Hackathon[] {
  return getItem<Hackathon[]>(STORAGE_KEYS.HACKATHONS) ?? [];
}

// ---------------------------------------------------------------------------
// Hackathon Details
// ---------------------------------------------------------------------------

export function getHackathonDetails(): HackathonDetail[] {
  return getItem<HackathonDetail[]>(STORAGE_KEYS.HACKATHON_DETAILS) ?? [];
}

export function getHackathonDetail(
  slug: string,
): HackathonDetail | undefined {
  return getHackathonDetails().find((d) => d.slug === slug);
}

// ---------------------------------------------------------------------------
// Teams
// ---------------------------------------------------------------------------

export function getTeams(hackathonSlug?: string): Team[] {
  const all = getItem<Team[]>(STORAGE_KEYS.TEAMS) ?? [];
  if (!hackathonSlug) return all;
  return all.filter((t) => t.hackathonSlug === hackathonSlug);
}

export function addTeam(team: Team): void {
  const all = getItem<Team[]>(STORAGE_KEYS.TEAMS) ?? [];
  all.push(team);
  setItem(STORAGE_KEYS.TEAMS, all);
}

// ---------------------------------------------------------------------------
// Submissions
// ---------------------------------------------------------------------------

export function getSubmissions(hackathonSlug?: string): Submission[] {
  const all = getItem<Submission[]>(STORAGE_KEYS.SUBMISSIONS) ?? [];
  if (!hackathonSlug) return all;
  return all.filter((s) => s.hackathonSlug === hackathonSlug);
}

export function addSubmission(submission: Submission): void {
  const all = getItem<Submission[]>(STORAGE_KEYS.SUBMISSIONS) ?? [];
  all.push(submission);
  setItem(STORAGE_KEYS.SUBMISSIONS, all);
}

// ---------------------------------------------------------------------------
// Leaderboards
// ---------------------------------------------------------------------------

export function getLeaderboards(): LeaderboardData[] {
  return getItem<LeaderboardData[]>(STORAGE_KEYS.LEADERBOARDS) ?? [];
}

export function getLeaderboard(
  hackathonSlug: string,
): LeaderboardData | undefined {
  return getLeaderboards().find((l) => l.hackathonSlug === hackathonSlug);
}

// ---------------------------------------------------------------------------
// User Profile
// ---------------------------------------------------------------------------

export function getUserProfile(): UserProfile | null {
  return getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);
}

export function setUserProfile(profile: UserProfile): void {
  setItem(STORAGE_KEYS.USER_PROFILE, profile);
}

export function clearUserProfile(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
}
