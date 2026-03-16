import { hackathons } from "@/data/hackathons";
import { hackathonDetails } from "@/data/hackathon-details";
import { teams } from "@/data/teams";
import { leaderboards } from "@/data/leaderboards";

const STORAGE_KEYS = {
  HACKATHONS: "hackathons",
  HACKATHON_DETAILS: "hackathonDetails",
  TEAMS: "teams",
  SUBMISSIONS: "submissions",
  LEADERBOARDS: "leaderboards",
} as const;

/**
 * localStorage가 비어 있으면 초기 데이터를 저장한다.
 * 데이터가 손상(JSON parse 실패)된 경우에도 재초기화한다.
 */
export function initializeData(): void {
  if (typeof window === "undefined") return;

  const seed: Record<string, unknown> = {
    [STORAGE_KEYS.HACKATHONS]: hackathons,
    [STORAGE_KEYS.HACKATHON_DETAILS]: hackathonDetails,
    [STORAGE_KEYS.TEAMS]: teams,
    [STORAGE_KEYS.SUBMISSIONS]: [],
    [STORAGE_KEYS.LEADERBOARDS]: leaderboards,
  };

  for (const [key, defaultValue] of Object.entries(seed)) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        continue;
      }
      // 파싱 시도 — 실패하면 catch에서 재초기화
      JSON.parse(raw);
    } catch {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    }
  }
}
