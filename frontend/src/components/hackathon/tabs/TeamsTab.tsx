"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { getTeams } from "@/lib/storage";
import type { Team, TeamsSection } from "@/lib/types";

interface TeamsTabProps {
  data: TeamsSection;
  hackathonSlug: string;
}

export function TeamsTab({ data, hackathonSlug }: TeamsTabProps) {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    setTeams(getTeams(hackathonSlug));
  }, [hackathonSlug]);

  if (!data.campEnabled) {
    return (
      <EmptyState
        title="팀 모집이 비활성화되어 있습니다."
        description="이 해커톤에서는 팀 모집 기능을 사용할 수 없습니다."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">참가 팀</h3>
        <Link href={`/camp?hackathon=${hackathonSlug}`}>
          <Button size="sm">팀 보기/만들기 &rarr;</Button>
        </Link>
      </div>

      {teams.length === 0 ? (
        <EmptyState
          title="아직 등록된 팀이 없습니다."
          description="첫 번째 팀을 만들어 보세요!"
          action={{
            label: "팀 만들기",
            onClick: () => {
              window.location.href = `/camp?hackathon=${hackathonSlug}`;
            },
          }}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {teams.map((team) => (
            <Card key={team.teamCode} size="sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {team.name}
                  <StatusBadge status={team.isOpen ? "open" : "closed"} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{team.memberCount}명</span>
                  <span>·</span>
                  <div className="flex flex-wrap gap-1">
                    {team.lookingFor.map((role) => (
                      <Badge key={role} variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
