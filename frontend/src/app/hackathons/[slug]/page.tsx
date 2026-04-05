"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DdayCountdown } from "@/components/hackathon/DdayCountdown";
import { HackathonTabs } from "@/components/hackathon/HackathonTabs";
import { initializeData } from "@/lib/init-data";
import { getHackathonDetail, getHackathons } from "@/lib/storage";
import type { Hackathon, HackathonDetail } from "@/lib/types";

export default function HackathonDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [detail, setDetail] = useState<HackathonDetail | undefined>();
  const [hackathon, setHackathon] = useState<Hackathon | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData();
    const d = getHackathonDetail(slug);
    const h = getHackathons().find((h) => h.slug === slug);
    setDetail(d);
    setHackathon(h);
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">불러오는 중...</div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <h2 className="text-xl font-semibold">해커톤을 찾을 수 없습니다.</h2>
        <p className="text-sm text-muted-foreground">
          요청하신 해커톤이 존재하지 않거나 삭제되었습니다.
        </p>
        <Link href="/hackathons">
          <Button variant="outline">목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-start gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{detail.title}</h1>
          {hackathon && <StatusBadge status={hackathon.status} />}
        </div>
        {hackathon && (
          <DdayCountdown
            deadlineAt={hackathon.period.submissionDeadlineAt}
            status={hackathon.status}
          />
        )}
      </div>

      <HackathonTabs sections={detail.sections} hackathonSlug={slug} />
    </div>
  );
}
