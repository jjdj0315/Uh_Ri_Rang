"use client";

import { useEffect, useState, useMemo } from "react";
import { Trophy } from "lucide-react";
import { initializeData } from "@/lib/init-data";
import { getLeaderboards, getHackathons, getUserProfile } from "@/lib/storage";
import { RankingTable } from "@/components/rankings/RankingTable";
import { Podium } from "@/components/rankings/Podium";
import { MyRankCard } from "@/components/rankings/MyRankCard";
import { ScoreDistributionBar } from "@/components/rankings/ScoreDistributionBar";
import { EmptyState } from "@/components/common/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Hackathon, LeaderboardData, LeaderboardEntry } from "@/lib/types";

export default function RankingsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [leaderboards, setLeaderboards] = useState<LeaderboardData[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [myTeamName, setMyTeamName] = useState<string | undefined>();

  useEffect(() => {
    initializeData();

    const profile = getUserProfile();
    if (profile) {
      // 첫 번째 팀이름으로 초기값 (해커톤 변경 시 업데이트됨)
      const firstTeam = profile.teams?.[0];
      if (firstTeam) setMyTeamName(firstTeam.teamName);
    }

    const lbs = getLeaderboards();
    const hacks = getHackathons();
    setLeaderboards(lbs);
    setHackathons(hacks);

    // 기본: 리더보드가 있는 첫 번째 해커톤 선택
    if (lbs.length > 0) {
      setSelectedSlug(lbs[0].hackathonSlug);
    }
  }, []);

  // 리더보드가 있는 해커톤만 필터
  const hackathonsWithLeaderboard = useMemo(() => {
    const slugSet = new Set(leaderboards.map((lb) => lb.hackathonSlug));
    return hackathons.filter((h) => slugSet.has(h.slug));
  }, [hackathons, leaderboards]);

  const currentLeaderboard = useMemo(
    () => leaderboards.find((lb) => lb.hackathonSlug === selectedSlug),
    [leaderboards, selectedSlug]
  );

  const entries: LeaderboardEntry[] = currentLeaderboard?.entries ?? [];

  const selectedTitle = hackathons.find((h) => h.slug === selectedSlug)?.title ?? "전체";

  const myEntry = myTeamName
    ? entries.find((e) => e.teamName === myTeamName)
    : undefined;

  function handleChange(value: string | null) {
    if (!value) return;
    setSelectedSlug(value);
    // 해당 해커톤에서의 내 팀 찾기
    const profile = getUserProfile();
    const membership = profile?.teams?.find((t) => t.hackathonSlug === value);
    setMyTeamName(membership?.teamName);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">리더보드</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          해커톤별 순위를 확인하세요
        </p>
      </div>

      {/* 해커톤 선택 */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">해커톤</span>
        <Select value={selectedSlug} onValueChange={handleChange}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="해커톤을 선택하세요">
              {selectedTitle}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {hackathonsWithLeaderboard.map((h) => (
              <SelectItem key={h.slug} value={h.slug}>
                {h.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* My rank summary */}
      <div className="animate-card">
      <MyRankCard
        teamName={myEntry?.teamName ?? myTeamName}
        rank={myEntry?.rank}
        score={myEntry?.score}
        totalTeams={entries.length}
      />
      </div>

      {/* Score distribution */}
      {entries.length > 1 && (
        <ScoreDistributionBar entries={entries} myTeamName={myTeamName} />
      )}

      {entries.length > 0 ? (
        <>
          {/* Top 3 Podium */}
          <div className="animate-card">
            <Podium entries={entries.filter((e) => e.rank <= 3)} />
          </div>

          {/* Full ranking table */}
          <div className="animate-card">
            <RankingTable entries={entries} myTeamName={myTeamName} />
          </div>
        </>
      ) : (
        <EmptyState
          icon={<Trophy />}
          title="아직 리더보드 데이터가 없습니다."
          description="해커톤에 참가하고 제출하면 리더보드에 반영됩니다."
        />
      )}
    </div>
  );
}
