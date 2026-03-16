import type { ScheduleSection } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface ScheduleTabProps {
  data: ScheduleSection;
}

export function ScheduleTab({ data }: ScheduleTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">일정</h3>
      <p className="text-xs text-muted-foreground">
        타임존: {data.timezone}
      </p>

      <div className="relative ml-4">
        {/* 세로 라인 */}
        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-border" />

        <div className="space-y-6">
          {data.milestones.map((milestone, i) => (
            <div key={i} className="relative flex items-start gap-4 pl-6">
              {/* 노드 */}
              <div className="absolute left-0 top-1.5 -translate-x-1/2 size-3 rounded-full border-2 border-primary bg-background" />
              <div className="min-w-0">
                <p className="font-medium">{milestone.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(milestone.at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
