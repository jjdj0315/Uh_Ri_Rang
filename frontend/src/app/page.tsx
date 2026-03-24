"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Trophy, Calendar, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { initializeData } from "@/lib/init-data";
import { getHackathons, getHackathonDetail, getTeams } from "@/lib/storage";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Hackathon } from "@/lib/types";

interface HackathonWithMeta extends Hackathon {
  summary?: string;
  totalPrize?: number;
  teamCount: number;
}

export default function Home() {
  const [hackathons, setHackathons] = useState<HackathonWithMeta[]>([]);

  useEffect(() => {
    initializeData();

    const all = getHackathons();
    const active = all.filter((h) => h.status === "ongoing" || h.status === "upcoming");

    const enriched: HackathonWithMeta[] = active.map((h) => {
      const detail = getHackathonDetail(h.slug);
      const teams = getTeams(h.slug);
      const totalPrize = detail?.sections.prize?.items.reduce(
        (sum, item) => sum + item.amountKRW,
        0
      );
      return {
        ...h,
        summary: detail?.sections.overview.summary,
        totalPrize,
        teamCount: teams.length,
      };
    });

    setHackathons(enriched);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Section */}
      <section className="rounded-xl bg-muted/30 px-6 py-16 sm:py-20">
        <p className="mb-4 text-sm font-semibold tracking-widest text-primary/60 uppercase">
          HACKATHON PLATFORM
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          아이디어를 현실로.
          <br />
          함께 만드는 혁신
        </h1>
        <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          전국의 개발자, 디자이너, 기획자들과 함께 혁신적인 프로젝트를
          만들어보세요. 최고의 팀과 함께 성장할 기회를 제공합니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/hackathons">
            <Button size="lg">
              해커톤 둘러보기
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
          <Link href="/rankings">
            <Button size="lg" variant="outline">
              랭킹 보기
            </Button>
          </Link>
        </div>
      </section>

      {/* 진행 중인 해커톤 */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">진행 중인 해커톤</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            지금 바로 참여할 수 있는 해커톤을 확인하세요
          </p>
        </div>

        {hackathons.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hackathons.map((h) => (
              <Link key={h.slug} href={`/hackathons/${h.slug}`} className="animate-card">
                <Card className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <StatusBadge status={h.status} />
                    <CardTitle className="mt-3 text-lg leading-snug">
                      {h.title}
                    </CardTitle>
                    {h.summary && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {h.summary}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="border-t border-border pt-3" />
                    <div className="flex items-center justify-between text-sm">
                      {h.totalPrize ? (
                        <div className="flex items-center gap-1.5 font-medium text-primary">
                          <Trophy className="size-4" />
                          <span>{formatCurrency(h.totalPrize)}</span>
                        </div>
                      ) : (
                        <span />
                      )}
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="size-4" />
                        <span>
                          {formatDate(h.period.submissionDeadlineAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <UsersRound className="size-4" />
                      <span>{h.teamCount}팀 참가</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            현재 진행 중인 해커톤이 없습니다.
          </p>
        )}

        <div className="mt-8 flex justify-center">
          <Link href="/hackathons">
            <Button variant="outline" size="lg">
              모든 해커톤 보기
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
