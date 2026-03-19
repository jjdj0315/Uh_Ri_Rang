"use client";

import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface MyRankCardProps {
  teamName?: string;
  rank?: number;
  score?: number;
  totalTeams: number;
}

export function MyRankCard({
  teamName,
  rank,
  score,
  totalTeams,
}: MyRankCardProps) {
  const hasData = teamName && rank != null && score != null;

  if (!hasData) {
    return (
      <Card className="bg-primary/5 ring-primary/20">
        <CardContent className="flex items-center gap-3 py-4">
          <User className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            아직 참가하지 않았습니다
          </span>
        </CardContent>
      </Card>
    );
  }

  const topPercent = totalTeams > 0 ? Math.round((rank / totalTeams) * 100) : 0;

  return (
    <Card className="bg-primary/5 ring-primary/20">
      <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-1 py-4">
        <User className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium">
          내 팀: <strong>{teamName}</strong>
        </span>
        <span className="text-sm text-muted-foreground">|</span>
        <span className="text-sm font-medium">
          순위: <strong>{rank}위</strong>
        </span>
        <span className="text-sm text-muted-foreground">|</span>
        <span className="text-sm font-medium">
          점수: <strong>{score}</strong>
        </span>
        <span className="text-sm text-muted-foreground">|</span>
        <span className="text-xs font-semibold text-primary">
          상위 {topPercent}%
        </span>
      </CardContent>
    </Card>
  );
}
