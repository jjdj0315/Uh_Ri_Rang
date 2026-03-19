"use client";

import { useEffect, useState, useMemo } from "react";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initializeData } from "@/lib/init-data";
import { getLeaderboards, getUserProfile } from "@/lib/storage";
import { RankingTable } from "@/components/rankings/RankingTable";
import { Podium } from "@/components/rankings/Podium";
import { MyRankCard } from "@/components/rankings/MyRankCard";
import { ScoreDistributionBar } from "@/components/rankings/ScoreDistributionBar";
import { EmptyState } from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";
import type { LeaderboardEntry } from "@/lib/types";

type Period = "all" | "monthly" | "weekly";

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "monthly", label: "월간" },
  { value: "weekly", label: "주간" },
];

function filterByPeriod(
  entries: LeaderboardEntry[],
  period: Period
): LeaderboardEntry[] {
  if (period === "all") return entries;

  const now = new Date();
  const cutoff = new Date(now);

  if (period === "monthly") {
    cutoff.setMonth(cutoff.getMonth() - 1);
  } else {
    cutoff.setDate(cutoff.getDate() - 7);
  }

  return entries.filter((e) => new Date(e.submittedAt) >= cutoff);
}

export default function RankingsPage() {
  const [period, setPeriod] = useState<Period>("all");
  const [allEntries, setAllEntries] = useState<LeaderboardEntry[]>([]);
  const [myTeamName, setMyTeamName] = useState<string | undefined>();

  useEffect(() => {
    initializeData();

    // Read user profile to find my team
    const profile = getUserProfile();
    if (profile?.teamName) {
      setMyTeamName(profile.teamName);
    }

    // Aggregate all leaderboard entries across hackathons
    const leaderboards = getLeaderboards();
    const merged: Record<string, LeaderboardEntry> = {};

    for (const lb of leaderboards) {
      for (const entry of lb.entries) {
        const existing = merged[entry.teamName];
        if (!existing || entry.score > existing.score) {
          merged[entry.teamName] = { ...entry };
        }
      }
    }

    // Sort by score descending and re-rank
    const sorted = Object.values(merged)
      .sort((a, b) => b.score - a.score)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

    setAllEntries(sorted);
  }, []);

  const filtered = useMemo(() => {
    const result = filterByPeriod(allEntries, period);
    // Re-rank after filtering
    return result.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }, [allEntries, period]);

  // Find my team's entry in the filtered list
  const myEntry = myTeamName
    ? filtered.find((e) => e.teamName === myTeamName)
    : undefined;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">글로벌 랭킹</h1>

      {/* My rank summary */}
      <MyRankCard
        teamName={myEntry?.teamName ?? myTeamName}
        rank={myEntry?.rank}
        score={myEntry?.score}
        totalTeams={filtered.length}
      />

      {/* Score distribution bar */}
      {filtered.length > 0 && (
        <ScoreDistributionBar
          entries={filtered.map((e) => ({ teamName: e.teamName, score: e.score }))}
          myTeamName={myTeamName}
        />
      )}

      {/* Period filter */}
      <div className="flex gap-1.5">
        {PERIOD_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={period === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod(opt.value)}
            className={cn(
              period === opt.value && "pointer-events-none"
            )}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <>
          {/* Top 3 Podium */}
          <Podium entries={filtered.filter((e) => e.rank <= 3)} />

          {/* Full ranking table */}
          <RankingTable entries={filtered} myTeamName={myTeamName} />
        </>
      ) : (
        <EmptyState
          icon={<Trophy />}
          title="아직 랭킹 데이터가 없습니다."
          description="해커톤에 참가하고 제출하면 랭킹에 반영됩니다."
        />
      )}
    </div>
  );
}
