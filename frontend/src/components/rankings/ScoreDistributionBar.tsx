"use client";

interface ScoreDistributionBarProps {
  entries: { teamName: string; score: number }[];
  myTeamName?: string;
}

export function ScoreDistributionBar({
  entries,
  myTeamName,
}: ScoreDistributionBarProps) {
  if (entries.length === 0) return null;

  const scores = entries.map((e) => e.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const range = maxScore - minScore;

  const myEntry = myTeamName
    ? entries.find((e) => e.teamName === myTeamName)
    : undefined;

  // Calculate marker position as percentage (0 = left/lowest, 100 = right/highest)
  const markerPercent =
    myEntry && range > 0
      ? ((myEntry.score - minScore) / range) * 100
      : myEntry
        ? 50
        : undefined;

  return (
    <div className="space-y-1">
      {/* Score range labels */}
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{minScore.toLocaleString()}점</span>
        <span>{maxScore.toLocaleString()}점</span>
      </div>

      {/* The bar */}
      <div className="relative">
        <div className="h-2 w-full rounded-full bg-gradient-to-r from-slate-200 to-primary dark:from-slate-700 dark:to-primary" />

        {/* Dot marker on the bar */}
        {myEntry && markerPercent != null && (
          <div
            className="absolute top-1/2 h-3.5 w-3.5 rounded-full border-2 border-white bg-primary shadow dark:border-slate-900"
            style={{
              left: `${markerPercent}%`,
              transform: "translateX(-50%) translateY(-50%)",
            }}
          />
        )}
      </div>

      {/* My team label below the bar */}
      {myEntry && markerPercent != null ? (
        <div
          className="relative"
        >
          <div
            className={`absolute top-0 flex items-center gap-1 ${
              markerPercent > 75
                ? "right-0"
                : markerPercent < 25
                  ? "left-0"
                  : ""
            }`}
            style={
              markerPercent >= 25 && markerPercent <= 75
                ? { left: `${markerPercent}%`, transform: "translateX(-50%)" }
                : undefined
            }
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              className="text-primary fill-current shrink-0"
            >
              <circle cx="4" cy="4" r="4" />
            </svg>
            <span className="text-xs font-semibold text-primary whitespace-nowrap">
              {myEntry.teamName} · {myEntry.score}점
            </span>
          </div>
        </div>
      ) : !myEntry ? (
        <p className="text-xs text-muted-foreground">
          아직 참가하지 않았습니다
        </p>
      ) : null}
    </div>
  );
}
