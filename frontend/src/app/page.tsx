"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { initializeData } from "@/lib/init-data";

export default function Home() {
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Banner */}
      <section className="relative -mx-4 -mt-8 overflow-hidden rounded-b-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 px-6 py-20 text-white dark:from-violet-900 dark:via-indigo-900 dark:to-blue-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            DAKER
          </h1>
          <p className="text-lg text-white/80 sm:text-xl">
            다양한 해커톤에 참가하고, 팀을 만들고, 실력을 겨뤄보세요.
          </p>
          <Link href="/hackathons">
            <Button
              size="lg"
              className="bg-white text-indigo-700 hover:bg-white/90"
            >
              해커톤 보러가기
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Shortcut Cards */}
      <section className="grid gap-6 sm:grid-cols-2">
        <Link href="/camp" className="group">
          <Card className="h-full transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
                <Users className="size-5" />
              </div>
              <CardTitle className="text-lg">팀 모집</CardTitle>
              <CardDescription>
                함께할 팀원을 찾거나, 팀을 만들어 해커톤에 도전하세요.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/rankings" className="group">
          <Card className="h-full transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Trophy className="size-5" />
              </div>
              <CardTitle className="text-lg">랭킹</CardTitle>
              <CardDescription>
                해커톤 참가자들의 순위를 확인하고 실력을 겨뤄보세요.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </section>
    </div>
  );
}
