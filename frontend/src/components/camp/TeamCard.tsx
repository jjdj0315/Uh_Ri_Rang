"use client";

import { useEffect, useState } from "react";
import type { Team } from "@/lib/types";
import { getTeamMembers } from "@/lib/storage";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ExternalLinkIcon, UsersIcon, UserPlus, CrownIcon, UserIcon } from "lucide-react";

interface TeamCardProps {
  team: Team;
  canJoin?: boolean;
  onJoinTeam?: (team: Team) => void;
}

function SegmentedProgressBar({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  const segments = Array.from({ length: max }, (_, i) => i < current);
  const isFull = current >= max;

  return (
    <div className="flex gap-1 w-full mt-1.5">
      {segments.map((filled, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full transition-colors ${
            filled
              ? isFull
                ? "bg-orange-500 dark:bg-orange-400"
                : "bg-primary"
              : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

export function TeamCard({ team, canJoin, onJoinTeam }: TeamCardProps) {
  const isFull = team.memberCount >= team.maxTeamSize;
  const [members, setMembers] = useState<{ nickname: string; role: "leader" | "member" }[]>([]);

  useEffect(() => {
    setMembers(getTeamMembers(team.teamCode));
  }, [team.teamCode]);

  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 flex flex-col h-[320px]">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg font-semibold">{team.name}</CardTitle>
          <StatusBadge status={team.isOpen ? "open" : "closed"} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <UsersIcon className="size-4" />
              <span>
                {team.memberCount}/{team.maxTeamSize}명
              </span>
            </div>
            {isFull && (
              <span className="text-xs text-orange-500 dark:text-orange-400 font-medium">
                정원 마감
              </span>
            )}
          </div>
          <SegmentedProgressBar
            current={team.memberCount}
            max={team.maxTeamSize}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-3 flex-1 overflow-y-auto">
        {/* 멤버 목록 */}
        {members.length > 0 && (
          <div className="space-y-1.5">
            {members.map((m) => (
              <div key={m.nickname} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                {m.role === "leader" ? (
                  <CrownIcon className="size-3.5 text-amber-500 shrink-0" />
                ) : (
                  <UserIcon className="size-3.5 shrink-0" />
                )}
                <span>{m.nickname}</span>
              </div>
            ))}
          </div>
        )}
        {team.lookingFor.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {team.lookingFor.map((role) => (
              <Badge key={role} variant="outline">
                {role}
              </Badge>
            ))}
          </div>
        )}
        {team.intro && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {team.intro}
          </p>
        )}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() =>
              window.open(team.contact.url, "_blank", "noopener,noreferrer")
            }
          >
            <ExternalLinkIcon className="size-4 mr-1" />
            연락하기
          </Button>
          {canJoin && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onJoinTeam?.(team)}
            >
              <UserPlus className="size-4 mr-1" />
              참여하기
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
