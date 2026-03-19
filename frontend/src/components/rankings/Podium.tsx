"use client";

import { Trophy, Medal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PodiumEntry {
  rank: number;
  teamName: string;
  score: number;
}

interface PodiumProps {
  entries: PodiumEntry[];
}

const PODIUM_CONFIG: Record<
  number,
  {
    icon: typeof Trophy;
    colorClass: string;
    borderClass: string;
    bgClass: string;
    heightClass: string;
    iconSize: number;
    label: string;
  }
> = {
  1: {
    icon: Trophy,
    colorClass: "text-amber-500",
    borderClass: "ring-amber-500/50 dark:ring-amber-400/40",
    bgClass: "bg-amber-500/10 dark:bg-amber-500/15",
    heightClass: "pt-2",
    iconSize: 32,
    label: "1st",
  },
  2: {
    icon: Medal,
    colorClass: "text-slate-400 dark:text-slate-300",
    borderClass: "ring-slate-400/50 dark:ring-slate-400/40",
    bgClass: "bg-slate-400/10 dark:bg-slate-400/15",
    heightClass: "pt-6",
    iconSize: 26,
    label: "2nd",
  },
  3: {
    icon: Medal,
    colorClass: "text-orange-700 dark:text-orange-500",
    borderClass: "ring-orange-700/50 dark:ring-orange-500/40",
    bgClass: "bg-orange-700/10 dark:bg-orange-500/15",
    heightClass: "pt-8",
    iconSize: 24,
    label: "3rd",
  },
};

function PodiumCard({ entry }: { entry: PodiumEntry }) {
  const config = PODIUM_CONFIG[entry.rank];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className={cn("flex flex-col items-center", config.heightClass)}>
      <Icon size={config.iconSize} className={cn("mb-2", config.colorClass)} />
      <Card
        className={cn(
          "w-full text-center ring-2",
          config.borderClass,
          config.bgClass
        )}
      >
        <CardContent className="flex flex-col items-center gap-1 py-4">
          <span
            className={cn(
              "text-xs font-bold uppercase tracking-wider",
              config.colorClass
            )}
          >
            {config.label}
          </span>
          <span className="text-sm font-semibold truncate max-w-[120px]">
            {entry.teamName}
          </span>
          <span className="text-lg font-bold font-mono tabular-nums">{entry.score}</span>
        </CardContent>
      </Card>
    </div>
  );
}

export function Podium({ entries }: PodiumProps) {
  if (entries.length === 0) return null;

  const first = entries.find((e) => e.rank === 1);
  const second = entries.find((e) => e.rank === 2);
  const third = entries.find((e) => e.rank === 3);

  // Layout order: 2nd | 1st | 3rd
  const ordered = [second, first, third].filter(Boolean) as PodiumEntry[];

  // If only 1 entry, center it; if 2, show them side by side
  if (ordered.length === 1) {
    return (
      <div className="flex justify-center">
        <div className="w-40">
          <PodiumCard entry={ordered[0]} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 items-end gap-3 max-w-lg mx-auto">
      {second ? (
        <PodiumCard entry={second} />
      ) : (
        <div />
      )}
      {first ? (
        <PodiumCard entry={first} />
      ) : (
        <div />
      )}
      {third ? (
        <PodiumCard entry={third} />
      ) : (
        <div />
      )}
    </div>
  );
}
