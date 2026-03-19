import type { LeaderboardEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RankingTableProps {
  entries: LeaderboardEntry[];
  myTeamName?: string;
}

const MEDAL: Record<number, string> = {
  1: "\u{1F947}",
  2: "\u{1F948}",
  3: "\u{1F949}",
};

export function RankingTable({ entries, myTeamName }: RankingTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">순위</th>
            <th className="px-4 py-3 text-left font-medium">팀명</th>
            <th className="px-4 py-3 text-right font-medium">점수</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => {
            const isMyTeam =
              myTeamName != null && entry.teamName === myTeamName;

            return (
              <tr
                key={`${entry.teamName}-${idx}`}
                className={cn(
                  "border-b border-border last:border-0 transition-colors hover:bg-muted/30",
                  isMyTeam && "bg-primary/10 border-l-2 border-l-primary"
                )}
              >
                <td className="px-4 py-3 font-medium">
                  {MEDAL[entry.rank] ? (
                    <span className="mr-1 text-base">{MEDAL[entry.rank]}</span>
                  ) : null}
                  <span
                    className={cn(
                      entry.rank <= 3 && "font-bold text-primary"
                    )}
                  >
                    {entry.rank}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {entry.teamName}
                  {isMyTeam && (
                    <span className="ml-2 text-xs font-semibold text-primary">
                      (내 팀)
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">
                  {entry.score}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
