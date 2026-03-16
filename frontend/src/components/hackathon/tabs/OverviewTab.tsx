import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OverviewSection } from "@/lib/types";

interface OverviewTabProps {
  data: OverviewSection;
}

export function OverviewTab({ data }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold">개요</h3>
        <p className="text-muted-foreground leading-relaxed">{data.summary}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>팀 구성 정책</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">솔로 참가</p>
              <p className="font-medium">
                {data.teamPolicy.allowSolo ? "허용" : "불가"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">최대 팀 인원</p>
              <p className="font-medium">{data.teamPolicy.maxTeamSize}명</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
