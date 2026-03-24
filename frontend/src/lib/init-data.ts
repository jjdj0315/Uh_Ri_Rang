import { hackathons } from "@/data/hackathons";
import { hackathonDetails } from "@/data/hackathon-details";
import { teams } from "@/data/teams";
import { leaderboards } from "@/data/leaderboards";
import { users } from "@/data/users";

const STORAGE_KEYS = {
  HACKATHONS: "hackathons",
  HACKATHON_DETAILS: "hackathonDetails",
  TEAMS: "teams",
  SUBMISSIONS: "submissions",
  LEADERBOARDS: "leaderboards",
  USERS: "users",
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
    [STORAGE_KEYS.USERS]: users,
  };

  for (const [key, defaultValue] of Object.entries(seed)) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        continue;
      }
      const parsed = JSON.parse(raw);

      // teams 데이터에 leaderName이 없으면 스키마 변경된 것이므로 재초기화
      if (
        key === STORAGE_KEYS.TEAMS &&
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        !("leaderName" in parsed[0])
      ) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
      }

      // users 데이터가 없거나 teams 배열이 없으면 재초기화
      if (
        key === STORAGE_KEYS.USERS &&
        (!Array.isArray(parsed) ||
          parsed.length === 0 ||
          !("teams" in parsed[0]))
      ) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
      }
    } catch {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    }
  }
}
