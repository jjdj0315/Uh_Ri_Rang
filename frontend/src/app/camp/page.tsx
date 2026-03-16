"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { initializeData } from "@/lib/init-data";
import { getHackathons, getTeams } from "@/lib/storage";
import type { Hackathon, Team } from "@/lib/types";
import { TeamCard } from "@/components/camp/TeamCard";
import { TeamCreateForm } from "@/components/camp/TeamCreateForm";
import { AISearchBar, type AIMatch } from "@/components/camp/AISearchBar";
import { AIMatchResult } from "@/components/camp/AIMatchResult";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, UsersIcon } from "lucide-react";

function CampContent() {
  const searchParams = useSearchParams();
  const hackathonParam = searchParams.get("hackathon") ?? "";

  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState(hackathonParam);
  const [teams, setTeams] = useState<Team[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [aiMatches, setAiMatches] = useState<AIMatch[] | null>(null);

  useEffect(() => {
    initializeData();
    setHackathons(getHackathons());
    loadTeams(hackathonParam);
  }, [hackathonParam]);

  function loadTeams(slug?: string) {
    const all = getTeams();
    setAllTeams(all);
    setTeams(slug ? getTeams(slug) : all);
  }

  function handleHackathonChange(value: string | null) {
    const slug = !value || value === "__all__" ? "" : value;
    setSelectedHackathon(slug);
    setTeams(slug ? getTeams(slug) : getTeams());
    setAiMatches(null);
  }

  function handleCreated() {
    loadTeams(selectedHackathon || undefined);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">팀원 모집</h1>
          <p className="text-sm text-muted-foreground">
            해커톤 팀을 찾거나 새로 만들어 보세요.
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <PlusIcon className="size-4 mr-1" />
          팀 만들기
        </Button>
      </div>

      {/* AI Search */}
      <section className="space-y-4 rounded-lg border p-4">
        <h2 className="text-lg font-semibold">AI 팀 매칭</h2>
        <p className="text-sm text-muted-foreground">
          원하는 조건을 자연어로 입력하면 AI가 적합한 팀을 추천해 드립니다.
        </p>
        <AISearchBar
          teams={allTeams}
          hackathonSlug={selectedHackathon || undefined}
          onResults={(matches) => setAiMatches(matches)}
        />
        {aiMatches !== null && (
          <AIMatchResult matches={aiMatches} teams={allTeams} />
        )}
      </section>

      {/* Hackathon Filter */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">해커톤 필터</span>
        <Select
          value={selectedHackathon || "__all__"}
          onValueChange={handleHackathonChange}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">전체</SelectItem>
            {hackathons.map((h) => (
              <SelectItem key={h.slug} value={h.slug}>
                {h.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Team Grid */}
      {teams.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard key={team.teamCode} team={team} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<UsersIcon />}
          title="등록된 팀이 없습니다"
          description="첫 번째 팀을 만들어 보세요!"
          action={{
            label: "팀 만들기",
            onClick: () => setShowCreateForm(true),
          }}
        />
      )}

      {/* Create Form Modal */}
      <TeamCreateForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        hackathonSlug={selectedHackathon || undefined}
        hackathons={hackathons}
        onCreated={handleCreated}
      />
    </div>
  );
}

export default function CampPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          로딩 중...
        </div>
      }
    >
      <CampContent />
    </Suspense>
  );
}
