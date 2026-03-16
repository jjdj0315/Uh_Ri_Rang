"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { getLeaderboard } from "@/lib/storage";
import type { LeaderboardData, LeaderboardSection } from "@/lib/types";

interface LeaderboardTabProps {
  data: LeaderboardSection;
  hackathonSlug: string;
}

export function LeaderboardTab({ data, hackathonSlug }: LeaderboardTabProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | undefined>();

  useEffect(() => {
    setLeaderboard(getLeaderboard(hackathonSlug));
  }, [hackathonSlug]);

  if (!leaderboard || leaderboard.entries.length === 0) {
    return (
      <div className="space-y-4">
        <EmptyState
          title="아직 리더보드가 없습니다."
          description={data.note}
        />
      </div>
    );
  }

  const hasBreakdown = leaderboard.entries.some((e) => e.scoreBreakdown);
  const hasArtifacts = leaderboard.entries.some((e) => e.artifacts);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">리더보드</h3>
      <p className="text-xs text-muted-foreground">{data.note}</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-3 py-2 font-medium">순위</th>
              <th className="px-3 py-2 font-medium">팀명</th>
              <th className="px-3 py-2 font-medium text-right">점수</th>
              {hasBreakdown && (
                <th className="px-3 py-2 font-medium text-right">상세 점수</th>
              )}
              {hasArtifacts && (
                <th className="px-3 py-2 font-medium">산출물</th>
              )}
            </tr>
          </thead>
          <tbody>
            {leaderboard.entries.map((entry) => (
              <tr
                key={entry.rank}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <td className="px-3 py-2">
                  <span
                    className={
                      entry.rank <= 3 ? "font-bold text-primary" : ""
                    }
                  >
                    {entry.rank}
                  </span>
                </td>
                <td className="px-3 py-2 font-medium">{entry.teamName}</td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {entry.score.toFixed(2)}
                </td>
                {hasBreakdown && (
                  <td className="px-3 py-2 text-right">
                    {entry.scoreBreakdown ? (
                      <div className="flex flex-wrap justify-end gap-2">
                        {Object.entries(entry.scoreBreakdown).map(
                          ([key, value]) => (
                            <span
                              key={key}
                              className="text-xs text-muted-foreground"
                            >
                              {key}: {value}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                )}
                {hasArtifacts && (
                  <td className="px-3 py-2">
                    {entry.artifacts ? (
                      <div className="flex gap-2">
                        {entry.artifacts.webUrl && (
                          <a
                            href={entry.artifacts.webUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary underline"
                          >
                            Web
                          </a>
                        )}
                        {entry.artifacts.pdfUrl && (
                          <a
                            href={entry.artifacts.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary underline"
                          >
                            PDF
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
