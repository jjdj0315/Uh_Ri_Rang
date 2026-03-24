import type {
  Hackathon,
  HackathonDetail,
  Team,
  Submission,
  LeaderboardData,
  UserProfile,
  UserAccount,
  TeamMembership,
  Notification,
} from "@/lib/types";

const STORAGE_KEYS = {
  HACKATHONS: "hackathons",
  HACKATHON_DETAILS: "hackathonDetails",
  TEAMS: "teams",
  SUBMISSIONS: "submissions",
  LEADERBOARDS: "leaderboards",
  USER_PROFILE: "userProfile",
  USERS: "users",
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

// ---------------------------------------------------------------------------
// User Accounts
// ---------------------------------------------------------------------------

export function getUsers(): UserAccount[] {
  return getItem<UserAccount[]>(STORAGE_KEYS.USERS) ?? [];
}

export function findUser(id: string): UserAccount | undefined {
  return getUsers().find((u) => u.id === id);
}

export function registerUser(account: UserAccount): boolean {
  const all = getUsers();
  if (all.some((u) => u.id === account.id)) return false;
  all.push(account);
  setItem(STORAGE_KEYS.USERS, all);
  return true;
}

export function loginUser(id: string, password: string): UserAccount | null {
  const user = findUser(id);
  if (!user || user.password !== password) return null;
  return user;
}

export function updateUserAccount(account: UserAccount): void {
  const all = getUsers();
  const idx = all.findIndex((u) => u.id === account.id);
  if (idx === -1) return;
  all[idx] = account;
  setItem(STORAGE_KEYS.USERS, all);
}

/** 현재 로그인한 유저의 프로필 변경 시 users 목록도 동기화 */
export function syncProfileToAccount(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  const userId = localStorage.getItem("currentUserId");
  if (!userId) return;
  const all = getUsers();
  const idx = all.findIndex((u) => u.id === userId);
  if (idx === -1) return;
  all[idx] = { ...all[idx], nickname: profile.nickname, skills: profile.skills, interests: profile.interests, teams: profile.teams };
  setItem(STORAGE_KEYS.USERS, all);
}

// ---------------------------------------------------------------------------
// Leaderboard Update (Submit → Leaderboard 연동)
// ---------------------------------------------------------------------------

export function updateLeaderboardOnSubmit(
  hackathonSlug: string,
  teamName: string,
  artifacts?: { webUrl?: string; pdfUrl?: string; planTitle?: string }
): void {
  const all = getItem<import("@/lib/types").LeaderboardData[]>(STORAGE_KEYS.LEADERBOARDS) ?? [];
  let lb = all.find((l) => l.hackathonSlug === hackathonSlug);

  if (!lb) {
    // 리더보드 없으면 새로 생성
    lb = { hackathonSlug, updatedAt: new Date().toISOString(), entries: [] };
    all.push(lb);
  }

  const existingIdx = lb.entries.findIndex((e) => e.teamName === teamName);

  if (existingIdx !== -1) {
    // 기존 엔트리 업데이트 (재제출)
    lb.entries[existingIdx].submittedAt = new Date().toISOString();
    if (artifacts) lb.entries[existingIdx].artifacts = artifacts;
    // 점수는 랜덤 소폭 변동 (데모용)
    lb.entries[existingIdx].score = Math.min(
      100,
      lb.entries[existingIdx].score + Math.random() * 3
    );
  } else {
    // 새 엔트리 추가 — 기본 점수는 기존 최하위 근처에서 랜덤
    const lowestScore = lb.entries.length > 0
      ? Math.min(...lb.entries.map((e) => e.score))
      : 50;
    const newScore = lowestScore + Math.random() * 15;

    lb.entries.push({
      rank: 0, // 아래에서 재정렬
      teamName,
      score: Math.round(newScore * 100) / 100,
      submittedAt: new Date().toISOString(),
      artifacts,
    });
  }

  // 점수 기준 재정렬 + rank 재부여
  lb.entries.sort((a, b) => b.score - a.score);
  lb.entries.forEach((e, i) => { e.rank = i + 1; });
  lb.updatedAt = new Date().toISOString();

  setItem(STORAGE_KEYS.LEADERBOARDS, all);
}

// ---------------------------------------------------------------------------
// Profile Helpers (teams 배열 기반)
// ---------------------------------------------------------------------------

/** 특정 해커톤에서의 유저 역할 조회 */
export function getRoleForHackathon(
  profile: UserProfile | null,
  hackathonSlug?: string
): { role: "leader" | "member" | "unaffiliated"; membership?: TeamMembership } {
  if (!profile || !hackathonSlug || !profile.teams) return { role: "unaffiliated" };
  const m = profile.teams.find((t) => t.hackathonSlug === hackathonSlug);
  if (!m) return { role: "unaffiliated" };
  return { role: m.role, membership: m };
}

/** 유저가 어떤 팀이든 소속되어 있는지 */
export function hasAnyTeam(profile: UserProfile | null): boolean {
  return (profile?.teams?.length ?? 0) > 0;
}

/** 특정 팀의 멤버 목록 조회 */
export function getTeamMembers(teamCode: string): { nickname: string; role: "leader" | "member" }[] {
  const users = getUsers();
  return users
    .filter((u) => u.teams.some((t) => t.teamCode === teamCode))
    .map((u) => {
      const membership = u.teams.find((t) => t.teamCode === teamCode)!;
      return { nickname: u.nickname, role: membership.role };
    })
    .sort((a, b) => (a.role === "leader" ? -1 : b.role === "leader" ? 1 : 0));
}

// ---------------------------------------------------------------------------
// Team Join / Leave
// ---------------------------------------------------------------------------

export function joinTeam(teamCode: string): void {
  const all = getItem<Team[]>(STORAGE_KEYS.TEAMS) ?? [];
  const idx = all.findIndex((t) => t.teamCode === teamCode);
  if (idx === -1) return;
  all[idx].memberCount += 1;
  if (all[idx].memberCount >= all[idx].maxTeamSize) {
    all[idx].isOpen = false;
  }
  setItem(STORAGE_KEYS.TEAMS, all);
}

export function leaveTeam(teamCode: string): void {
  const all = getItem<Team[]>(STORAGE_KEYS.TEAMS) ?? [];
  const idx = all.findIndex((t) => t.teamCode === teamCode);
  if (idx === -1) return;
  all[idx].memberCount = Math.max(0, all[idx].memberCount - 1);
  if (all[idx].memberCount < all[idx].maxTeamSize) {
    all[idx].isOpen = true;
  }
  setItem(STORAGE_KEYS.TEAMS, all);
}

// ---------------------------------------------------------------------------
// Notifications (유저별 알림함)
// ---------------------------------------------------------------------------

function getNotifKey(nickname: string): string {
  return `notifications_${nickname}`;
}

export function getNotifications(nickname: string): Notification[] {
  return getItem<Notification[]>(getNotifKey(nickname)) ?? [];
}

export function addNotification(targetNickname: string, notif: Notification): void {
  const all = getNotifications(targetNickname);
  // 중복 방지 (같은 팀에서 같은 사람이 보낸 요청)
  if (all.some((n) => n.teamCode === notif.teamCode && n.fromNickname === notif.fromNickname)) return;
  all.unshift(notif);
  setItem(getNotifKey(targetNickname), all);
}

export function markNotificationRead(nickname: string, notifId: string): void {
  const all = getNotifications(nickname);
  const idx = all.findIndex((n) => n.id === notifId);
  if (idx === -1) return;
  all[idx].read = true;
  setItem(getNotifKey(nickname), all);
}

export function removeNotification(nickname: string, notifId: string): void {
  const all = getNotifications(nickname).filter((n) => n.id !== notifId);
  setItem(getNotifKey(nickname), all);
}

export function getUnreadCount(nickname: string): number {
  return getNotifications(nickname).filter((n) => !n.read).length;
}
