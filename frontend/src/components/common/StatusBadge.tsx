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
    className: "bg-green-500/15 text-green-700 dark:text-green-400",
  },
  ended: {
    label: "종료",
    className: "bg-muted text-muted-foreground",
  },
  upcoming: {
    label: "예정",
    className: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  },
  open: {
    label: "모집중",
    className: "bg-green-500/15 text-green-700 dark:text-green-400",
  },
  closed: {
    label: "마감",
    className: "bg-muted text-muted-foreground",
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
