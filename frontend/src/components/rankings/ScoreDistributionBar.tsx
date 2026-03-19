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
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{minScore.toLocaleString()}점</span>
        <span>{maxScore.toLocaleString()}점</span>
      </div>

      {/* Bar with marker */}
      <div className="relative">
        {/* Marker above the bar */}
        {myEntry && markerPercent != null ? (
          <div
            className="absolute -top-6 flex flex-col items-center"
            style={{
              left: `${markerPercent}%`,
              transform: "translateX(-50%)",
            }}
          >
            <span className="text-[10px] font-semibold text-primary whitespace-nowrap">
              {myEntry.teamName}
            </span>
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              className="text-primary fill-current"
            >
              <polygon points="5,6 0,0 10,0" />
            </svg>
          </div>
        ) : null}

        {/* The bar */}
        <div className="h-2 w-full rounded-full bg-gradient-to-r from-slate-200 to-primary dark:from-slate-700 dark:to-primary" />

        {/* Dot marker on the bar */}
        {myEntry && markerPercent != null && (
          <div
            className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow dark:border-slate-900"
            style={{
              left: `${markerPercent}%`,
              transform: `translateX(-50%) translateY(-50%)`,
            }}
          />
        )}
      </div>

      {/* Fallback when no team */}
      {!myEntry && (
        <p className="text-xs text-muted-foreground">
          아직 참가하지 않았습니다
        </p>
      )}
    </div>
  );
}
