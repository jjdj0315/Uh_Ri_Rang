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

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{team.name}</CardTitle>
          <StatusBadge status={team.isOpen ? "open" : "closed"} />
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <UsersIcon className="size-4" />
          <span>{team.memberCount}/5명</span>
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
