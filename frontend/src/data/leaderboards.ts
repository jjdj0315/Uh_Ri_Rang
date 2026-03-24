import type { LeaderboardData } from "@/lib/types";

export const leaderboards: LeaderboardData[] = [
  {
    hackathonSlug: "aimers-8-model-lite",
    updatedAt: "2026-02-26T10:00:00+09:00",
    entries: [
      {
        rank: 1,
        teamName: "Team Alpha",
        score: 0.7421,
        submittedAt: "2026-02-24T21:05:00+09:00",
      },
      {
        rank: 2,
        teamName: "QuantSquad",
        score: 0.7256,
        submittedAt: "2026-02-25T08:10:00+09:00",
      },
      {
        rank: 3,
        teamName: "Team Gamma",
        score: 0.7013,
        submittedAt: "2026-02-25T09:40:00+09:00",
      },
      {
        rank: 4,
        teamName: "LightWeight",
        score: 0.6847,
        submittedAt: "2026-02-25T09:55:00+09:00",
      },
      {
        rank: 5,
        teamName: "CompressAI",
        score: 0.6532,
        submittedAt: "2026-02-24T18:20:00+09:00",
      },
    ],
  },
  {
    hackathonSlug: "daker-handover-2026-03",
    updatedAt: "2026-04-17T10:00:00+09:00",
    entries: [
      {
        rank: 1,
        teamName: "404found",
        score: 87.5,
        submittedAt: "2026-04-13T09:58:00+09:00",
        scoreBreakdown: { participant: 82, judge: 90 },
        artifacts: {
          webUrl: "https://404found.vercel.app",
          pdfUrl: "https://example.com/404found-solution.pdf",
          planTitle: "404found 기획서",
        },
      },
      {
        rank: 2,
        teamName: "LGTM",
        score: 84.2,
        submittedAt: "2026-04-13T09:40:00+09:00",
        scoreBreakdown: { participant: 79, judge: 88 },
        artifacts: {
          webUrl: "https://lgtm-hack.vercel.app",
          pdfUrl: "https://example.com/lgtm-solution.pdf",
          planTitle: "LGTM 기획서",
        },
      },
      {
        rank: 3,
        teamName: "ShipIt",
        score: 78.9,
        submittedAt: "2026-04-13T08:30:00+09:00",
        scoreBreakdown: { participant: 85, judge: 74 },
        artifacts: {
          webUrl: "https://shipit-daker.vercel.app",
          pdfUrl: "https://example.com/shipit-solution.pdf",
          planTitle: "ShipIt 기획서",
        },
      },
    ],
  },
  {
    hackathonSlug: "nlp-sentiment-2025",
    updatedAt: "2025-12-25T10:00:00+09:00",
    entries: [
      {
        rank: 1,
        teamName: "SentiMasters",
        score: 0.9234,
        submittedAt: "2025-12-19T22:00:00+09:00",
      },
      {
        rank: 2,
        teamName: "NLP Crew",
        score: 0.9101,
        submittedAt: "2025-12-20T09:30:00+09:00",
      },
      {
        rank: 3,
        teamName: "TextMiners",
        score: 0.8876,
        submittedAt: "2025-12-20T09:50:00+09:00",
      },
    ],
  },
  {
    hackathonSlug: "open-data-visualization",
    updatedAt: "2026-01-20T10:00:00+09:00",
    entries: [
      {
        rank: 1,
        teamName: "DataCanvas",
        score: 92.1,
        submittedAt: "2026-01-14T20:00:00+09:00",
        scoreBreakdown: { creativity: 95, usability: 90, insight: 91 },
      },
      {
        rank: 2,
        teamName: "VizWizards",
        score: 88.7,
        submittedAt: "2026-01-15T09:00:00+09:00",
        scoreBreakdown: { creativity: 85, usability: 92, insight: 89 },
      },
    ],
  },
];
