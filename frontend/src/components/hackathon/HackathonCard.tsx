import Link from "next/link";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { Hackathon } from "@/lib/types";

interface HackathonCardProps {
  hackathon: Hackathon;
}

export function HackathonCard({ hackathon }: HackathonCardProps) {
  return (
    <Link href={`/hackathons/${hackathon.slug}`}>
      <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 text-base font-semibold leading-snug">
              {hackathon.title}
            </CardTitle>
            <StatusBadge status={hackathon.status} />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {hackathon.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Period */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            <span>
              ~{formatDate(hackathon.period.submissionDeadlineAt)} 마감
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
