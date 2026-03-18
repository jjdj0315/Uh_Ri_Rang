// ============================================================
// Hackathon List
// ============================================================

export interface HackathonPeriod {
  timezone: string;
  submissionDeadlineAt: string;
  endAt: string;
}

export interface HackathonLinks {
  detail: string;
  rules: string;
  faq: string;
}

export interface Hackathon {
  slug: string;
  title: string;
  status: "ongoing" | "ended" | "upcoming";
  tags: string[];
  thumbnailUrl: string;
  period: HackathonPeriod;
  links: HackathonLinks;
}

// ============================================================
// Hackathon Detail
// ============================================================

export interface TeamPolicy {
  allowSolo: boolean;
  maxTeamSize: number;
}

export interface OverviewSection {
  summary: string;
  teamPolicy: TeamPolicy;
}

export interface InfoSection {
  notice: string[];
  links: {
    rules: string;
    faq: string;
  };
}

export interface ScoreBreakdownItem {
  key: string;
  label: string;
  weightPercent: number;
}

export interface EvalSection {
  metricName: string;
  description: string;
  /** 점수 기반이면 undefined, 투표 기반이면 "vote" */
  scoreSource?: string;
  scoreDisplay?: {
    label: string;
    breakdown: ScoreBreakdownItem[];
  };
  limits?: {
    maxRuntimeSec: number;
    maxSubmissionsPerDay: number;
  };
}

export interface Milestone {
  name: string;
  at: string;
}

export interface ScheduleSection {
  timezone: string;
  milestones: Milestone[];
}

export interface PrizeItem {
  place: string;
  amountKRW: number;
}

export interface PrizeSection {
  items: PrizeItem[];
}

export interface TeamsSection {
  campEnabled: boolean;
  listUrl: string;
}

export interface SubmissionItem {
  key: string;
  title: string;
  format: string;
}

export interface SubmitSection {
  allowedArtifactTypes: string[];
  submissionUrl: string;
  guide: string[];
  submissionItems?: SubmissionItem[];
}

export interface LeaderboardSection {
  publicLeaderboardUrl: string;
  note: string;
}

export interface HackathonSections {
  overview: OverviewSection;
  info: InfoSection;
  eval: EvalSection;
  schedule: ScheduleSection;
  prize?: PrizeSection;
  teams: TeamsSection;
  submit: SubmitSection;
  leaderboard: LeaderboardSection;
}

export interface HackathonDetail {
  slug: string;
  title: string;
  sections: HackathonSections;
}

// ============================================================
// Team (Camp)
// ============================================================

export interface TeamContact {
  type: string;
  url: string;
}

export interface Team {
  teamCode: string;
  hackathonSlug: string;
  name: string;
  isOpen: boolean;
  memberCount: number;
  maxTeamSize: number;
  lookingFor: string[];
  intro: string;
  contact: TeamContact;
  createdAt: string;
}

// ============================================================
// Submission
// ============================================================

export interface Submission {
  id: string;
  hackathonSlug: string;
  teamCode: string;
  teamName: string;
  artifactType: string;
  artifactUrl?: string;
  artifactText?: string;
  notes?: string;
  submittedAt: string;
}

// ============================================================
// Leaderboard
// ============================================================

export interface LeaderboardEntry {
  rank: number;
  teamName: string;
  score: number;
  submittedAt: string;
  scoreBreakdown?: Record<string, number>;
  artifacts?: {
    webUrl?: string;
    pdfUrl?: string;
    planTitle?: string;
  };
}

export interface LeaderboardData {
  hackathonSlug: string;
  updatedAt: string;
  entries: LeaderboardEntry[];
}

// ============================================================
// AI Match (Track 1 / Track 2)
// ============================================================

export interface MatchRequest {
  query: string;
  hackathonSlug?: string;
}

export interface MatchResponse {
  recommendations: {
    team: Team;
    reason: string;
    matchScore: number;
  }[];
}
