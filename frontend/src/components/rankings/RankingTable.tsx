import type { LeaderboardEntry } from "@/lib/types";

interface RankingTableProps {
  entries: LeaderboardEntry[];
}

const MEDAL: Record<number, string> = {
  1: "\u{1F947}",
  2: "\u{1F948}",
  3: "\u{1F949}",
};

export function RankingTable({ entries }: RankingTableProps) {
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
          {entries.map((entry, idx) => (
            <tr
              key={`${entry.teamName}-${idx}`}
              className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
            >
              <td className="px-4 py-3 font-medium">
                {MEDAL[entry.rank] ? (
                  <span className="mr-1">{MEDAL[entry.rank]}</span>
                ) : null}
                {entry.rank}
              </td>
              <td className="px-4 py-3">{entry.teamName}</td>
              <td className="px-4 py-3 text-right tabular-nums">
                {entry.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
