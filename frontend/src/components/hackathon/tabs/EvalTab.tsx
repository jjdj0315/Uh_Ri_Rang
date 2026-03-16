import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EvalSection } from "@/lib/types";

interface EvalTabProps {
  data: EvalSection;
}

export function EvalTab({ data }: EvalTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-1 text-lg font-semibold">{data.metricName}</h3>
        <p className="text-muted-foreground">{data.description}</p>
      </div>

      {data.limits && (
        <Card>
          <CardHeader>
            <CardTitle>제한 사항</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">최대 실행 시간</p>
                <p className="font-medium">{data.limits.maxRuntimeSec}초</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">일일 최대 제출</p>
                <p className="font-medium">
                  {data.limits.maxSubmissionsPerDay}회
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {data.scoreSource === "vote" && data.scoreDisplay && (
        <Card>
          <CardHeader>
            <CardTitle>{data.scoreDisplay.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.scoreDisplay.breakdown.map((item) => (
              <div key={item.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="font-medium">{item.weightPercent}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${item.weightPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
