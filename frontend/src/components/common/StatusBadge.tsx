import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "ongoing" | "ended" | "upcoming" | "open" | "closed";
}

const statusConfig: Record<
  StatusBadgeProps["status"],
  { label: string; className: string }
> = {
  ongoing: {
    label: "진행중",
    className: "bg-green-600/15 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  },
  ended: {
    label: "종료",
    className: "bg-slate-400/15 text-slate-400 dark:bg-slate-400/20 dark:text-slate-400",
  },
  upcoming: {
    label: "예정",
    className: "bg-amber-600/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  },
  open: {
    label: "모집중",
    className: "bg-green-600/15 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  },
  closed: {
    label: "마감",
    className: "bg-slate-400/15 text-slate-400 dark:bg-slate-400/20 dark:text-slate-400",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={cn(config.className)}>
      {config.label}
    </Badge>
  );
}
