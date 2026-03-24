"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { initializeData } from "@/lib/init-data";
import {
  getHackathons,
  getTeams,
  getUserProfile,
  setUserProfile as saveUserProfile,
  joinTeam,
  syncProfileToAccount,
  getRoleForHackathon,
  getTeamMembers,
} from "@/lib/storage";
import type { Hackathon, Team, UserProfile } from "@/lib/types";
import { TeamCard } from "@/components/camp/TeamCard";
import { TeamCreateForm } from "@/components/camp/TeamCreateForm";
import { AISearchBar, type AIMatch } from "@/components/camp/AISearchBar";
import { AIMatchResult } from "@/components/camp/AIMatchResult";
import { EmptyState } from "@/components/common/EmptyState";
import { LoginRequiredDialog } from "@/components/common/LoginRequiredDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, UsersIcon, CrownIcon, UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function CampContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hackathonParam = searchParams.get("hackathon") ?? "";

  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState(hackathonParam);
  const [teams, setTeams] = useState<Team[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [aiMatches, setAiMatches] = useState<AIMatch[] | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // 현재 선택된 해커톤 기준으로 역할 판단
  const { role: currentRole, membership: currentMembership } =
    getRoleForHackathon(userProfile, selectedHackathon);
  const isTeamMember = currentRole === "leader" || currentRole === "member";
  const isGuest = userProfile?.nickname === "게스트";
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const requireLogin = () => {
    setLoginDialogOpen(true);
  };

  useEffect(() => {
    initializeData();
    setHackathons(getHackathons());

    const profile = getUserProfile();
    if (profile) {
      setUserProfile(profile);
    }

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
    const updated = getUserProfile();
    if (updated) setUserProfile(updated);
    loadTeams(selectedHackathon || undefined);
  }

  function handleJoinTeam(team: Team) {
    if (!userProfile) return;
    if (isGuest) { requireLogin(); return; }
    joinTeam(team.teamCode);
    const updated: UserProfile = {
      ...userProfile,
      teams: [
        ...userProfile.teams,
        {
          hackathonSlug: team.hackathonSlug,
          teamCode: team.teamCode,
          teamName: team.name,
          role: "member",
        },
      ],
    };
    saveUserProfile(updated);
    syncProfileToAccount(updated);
    setUserProfile(updated);
    loadTeams(selectedHackathon || undefined);
  }

  // 현재 해커톤에서의 내 팀
  const myTeam = currentMembership
    ? allTeams.find((t) => t.teamCode === currentMembership.teamCode)
    : undefined;

  // 내 팀 제외한 다른 팀 목록
  const otherTeams = myTeam
    ? teams.filter((t) => t.teamCode !== myTeam.teamCode)
    : teams;

  // 현재 해커톤에서 이미 팀에 소속되어 있는지
  const alreadyInTeamForHackathon = currentMembership !== undefined;

  // 이 해커톤에서 참여 가능한지 (이미 이 해커톤 팀에 소속이면 불가)
  const canJoinTeam = (team: Team) =>
    !alreadyInTeamForHackathon &&
    team.isOpen &&
    team.memberCount < team.maxTeamSize;

  // 소속 해커톤 이름
  const myHackathonTitle = selectedHackathon
    ? hackathons.find((h) => h.slug === selectedHackathon)?.title
    : undefined;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            {isTeamMember ? "팀원 찾기" : "팀 찾기"}
          </h1>
          {!alreadyInTeamForHackathon && (
            <Button onClick={() => isGuest ? requireLogin() : setShowCreateForm(true)}>
              <PlusIcon className="size-4 mr-1" />
              팀 만들기
            </Button>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {isTeamMember
            ? "우리 팀에 합류할 팀원을 찾아보세요."
            : "함께할 팀을 찾거나, 새로운 팀을 만들어보세요."}
        </p>
      </div>

      {/* 내 팀 카드 (현재 해커톤에서 소속된 팀이 있을 때) */}
      {isTeamMember && myTeam && currentMembership && (
        <Card className="ring-2 ring-primary/30 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              {currentRole === "leader" ? (
                <CrownIcon className="size-5 text-amber-500" />
              ) : (
                <UserIcon className="size-5 text-primary" />
              )}
              <CardTitle className="text-lg">내 팀</CardTitle>
              <Badge variant="outline" className="ml-auto">
                {currentRole === "leader" ? "팀장" : "팀원"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">{myTeam.name}</span>
              <span className="text-sm text-muted-foreground">
                <UsersIcon className="size-4 inline mr-1" />
                {myTeam.memberCount}/{myTeam.maxTeamSize}명
              </span>
            </div>
            {myHackathonTitle && (
              <p className="text-sm text-muted-foreground">
                {myHackathonTitle}
              </p>
            )}
            {myTeam.intro && (
              <p className="text-sm text-muted-foreground">{myTeam.intro}</p>
            )}
            {/* 팀원 목록 */}
            <div className="pt-2 border-t border-border space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">팀원</span>
              {getTeamMembers(myTeam.teamCode).map((m) => (
                <div key={m.nickname} className="flex items-center gap-1.5 text-sm">
                  {m.role === "leader" ? (
                    <CrownIcon className="size-3.5 text-amber-500 shrink-0" />
                  ) : (
                    <UserIcon className="size-3.5 text-muted-foreground shrink-0" />
                  )}
                  <span>{m.nickname}</span>
                  {m.role === "leader" && (
                    <span className="text-xs text-muted-foreground">(팀장)</span>
                  )}
                </div>
              ))}
            </div>
            {myTeam.lookingFor.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-xs text-muted-foreground">모집 중:</span>
                {myTeam.lookingFor.map((role) => (
                  <Badge key={role} variant="outline">
                    {role}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Search */}
      <section className="space-y-4 rounded-lg border p-4">
        <h2 className="text-lg font-semibold">
          {isTeamMember ? "AI 팀원 매칭" : "AI 팀 매칭"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isTeamMember
            ? "원하는 조건을 자연어로 입력하면 AI가 적합한 팀원을 추천해 드립니다."
            : "원하는 조건을 자연어로 입력하면 AI가 적합한 팀을 추천해 드립니다."}
        </p>
        <AISearchBar
          teams={allTeams}
          hackathonSlug={selectedHackathon || undefined}
          role={currentRole}
          skills={userProfile?.skills}
          interests={userProfile?.interests}
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
            <SelectValue placeholder="전체">
              {selectedHackathon
                ? hackathons.find((h) => h.slug === selectedHackathon)
                    ?.title ?? "전체"
                : "전체"}
            </SelectValue>
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

      {/* 다른 팀 목록 */}
      {isTeamMember && otherTeams.length > 0 && (
        <h3 className="text-sm font-medium text-muted-foreground">
          같은 해커톤의 다른 팀
        </h3>
      )}

      {otherTeams.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otherTeams.map((team) => (
            <div key={team.teamCode} className="animate-card">
              <TeamCard
                team={team}
                canJoin={canJoinTeam(team)}
                onJoinTeam={handleJoinTeam}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<UsersIcon />}
          title="등록된 팀이 없습니다"
          description={
            isTeamMember
              ? "아직 같은 해커톤에 다른 팀이 없습니다."
              : "첫 번째 팀을 만들어 보세요!"
          }
          action={
            isTeamMember
              ? undefined
              : {
                  label: "팀 만들기",
                  onClick: () => isGuest ? requireLogin() : setShowCreateForm(true),
                }
          }
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

      <LoginRequiredDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
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
