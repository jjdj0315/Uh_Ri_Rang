"use client";

import type { Team } from "@/lib/types";
import type { AIMatch } from "./AISearchBar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, SparklesIcon } from "lucide-react";

interface AIMatchResultProps {
  matches: AIMatch[];
  teams: Team[];
}

export function AIMatchResult({ matches, teams }: AIMatchResultProps) {
  if (matches.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        조건에 맞는 팀을 찾지 못했습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-1.5 text-sm font-medium">
        <SparklesIcon className="size-4 text-yellow-500" />
        AI 추천 결과
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => {
          const team = teams.find((t) => t.teamCode === match.teamCode);
          const scorePercent = Math.round(match.score * 100);

          return (
            <Card key={match.teamCode} size="sm" className="animate-card flex flex-col h-[220px]">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{match.teamName}</CardTitle>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {scorePercent}%
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <p className="text-sm text-muted-foreground">{match.reason}</p>
              </CardContent>
              {team && (
                <CardFooter>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      window.open(
                        team.contact.url,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <ExternalLinkIcon className="size-4 mr-1" />
                    연락하기
                  </Button>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
