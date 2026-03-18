"use client";

import type { Team } from "@/lib/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ExternalLinkIcon, UsersIcon } from "lucide-react";

interface TeamCardProps {
  team: Team;
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

export function TeamCard({ team }: TeamCardProps) {
  const isFull = team.memberCount >= team.maxTeamSize;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{team.name}</CardTitle>
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

      <CardContent className="space-y-3">
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
      </CardContent>

      <CardFooter>
        <Button
          size="sm"
          className="w-full"
          onClick={() =>
            window.open(team.contact.url, "_blank", "noopener,noreferrer")
          }
        >
          <ExternalLinkIcon className="size-4 mr-1" />
          연락하기
        </Button>
      </CardFooter>
    </Card>
  );
}
