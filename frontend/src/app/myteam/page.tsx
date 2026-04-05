"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { initializeData } from "@/lib/init-data";
import {
  getUserProfile,
  setUserProfile,
  getTeams,
  getHackathons,
  getTeamMembers,
  getUsers,
  leaveTeam,
  syncProfileToAccount,
  addNotification,
} from "@/lib/storage";
import type { UserProfile, Team, Hackathon, TeamMembership, UserAccount } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { LoginRequiredDialog } from "@/components/common/LoginRequiredDialog";
import {
  CrownIcon,
  UserIcon,
  UsersIcon,
  Pencil,
  Check,
  X,
  LogOut,
  ArrowRight,
  SearchIcon,
  Loader2Icon,
  SparklesIcon,
} from "lucide-react";
import { toast } from "sonner";

interface TeamWithMeta {
  membership: TeamMembership;
  team: Team;
  hackathonTitle: string;
  members: { nickname: string; role: "leader" | "member" }[];
}

interface RecruitMatch {
  nickname: string;
  reason: string;
  score: number;
  skills?: string[];
  interests?: string[];
}

export default function MyTeamPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myTeams, setMyTeams] = useState<TeamWithMeta[]>([]);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [editingTeamCode, setEditingTeamCode] = useState<string | null>(null);
  const [editIntro, setEditIntro] = useState("");
  const [editLookingFor, setEditLookingFor] = useState("");

  // AI 팀원 추천
  const [recruitQuery, setRecruitQuery] = useState<Record<string, string>>({});
  const [recruitResults, setRecruitResults] = useState<Record<string, RecruitMatch[]>>({});
  const [recruitLoading, setRecruitLoading] = useState<string | null>(null);
  const [recruitError, setRecruitError] = useState<Record<string, string>>({});
  const [sentScouts, setSentScouts] = useState<Set<string>>(new Set());

  useEffect(() => {
    initializeData();
    const p = getUserProfile();
    if (p?.nickname === "게스트") {
      setShowLoginDialog(true);
      return;
    }
    loadData();
  }, []);

  function loadData() {
    const p = getUserProfile();
    setProfile(p);
    if (!p?.teams?.length) {
      setMyTeams([]);
      return;
    }

    const allTeams = getTeams();
    const hackathons = getHackathons();

    const enriched: TeamWithMeta[] = p.teams
      .map((membership) => {
        const team = allTeams.find((t) => t.teamCode === membership.teamCode);
        if (!team) return null;
        const hackathonTitle =
          hackathons.find((h) => h.slug === membership.hackathonSlug)?.title ??
          membership.hackathonSlug;
        const members = getTeamMembers(team.teamCode);
        return { membership, team, hackathonTitle, members };
      })
      .filter(Boolean) as TeamWithMeta[];

    setMyTeams(enriched);
  }

  function handleLeave(teamCode: string) {
    if (!profile) return;
    leaveTeam(teamCode);
    const updated: UserProfile = {
      ...profile,
      teams: profile.teams.filter((t) => t.teamCode !== teamCode),
    };
    setUserProfile(updated);
    syncProfileToAccount(updated);
    setProfile(updated);
    loadData();
  }

  function startEdit(team: Team) {
    setEditingTeamCode(team.teamCode);
    setEditIntro(team.intro);
    setEditLookingFor(team.lookingFor.join(", "));
  }

  function cancelEdit() {
    setEditingTeamCode(null);
  }

  function saveEdit(teamCode: string) {
    // localStorage의 teams 데이터 직접 수정
    const raw = localStorage.getItem("teams");
    if (!raw) return;
    const allTeams: Team[] = JSON.parse(raw);
    const idx = allTeams.findIndex((t) => t.teamCode === teamCode);
    if (idx === -1) return;

    allTeams[idx].intro = editIntro.trim();
    allTeams[idx].lookingFor = editLookingFor
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    localStorage.setItem("teams", JSON.stringify(allTeams));
    setEditingTeamCode(null);
    loadData();
  }

  function toggleRecruitment(teamCode: string, currentIsOpen: boolean) {
    const raw = localStorage.getItem("teams");
    if (!raw) return;
    const allTeams: Team[] = JSON.parse(raw);
    const idx = allTeams.findIndex((t) => t.teamCode === teamCode);
    if (idx === -1) return;

    allTeams[idx].isOpen = !currentIsOpen;
    localStorage.setItem("teams", JSON.stringify(allTeams));
    loadData();
  }

  async function handleRecruit(teamCode: string, hackathonSlug: string) {
    const q = recruitQuery[teamCode]?.trim();
    if (!q) return;

    setRecruitLoading(teamCode);
    setRecruitError((prev) => ({ ...prev, [teamCode]: "" }));

    try {
      // 해당 해커톤에 이미 소속된 유저 제외한 후보 목록
      const allUsers = getUsers();
      const candidates = allUsers
        .filter((u) => !u.teams.some((t) => t.hackathonSlug === hackathonSlug))
        .map((u) => ({ nickname: u.nickname, skills: u.skills, interests: u.interests }));

      const teamMeta = myTeams.find((t) => t.team.teamCode === teamCode);
      const teamInfo = {
        name: teamMeta?.team.name ?? "",
        hackathonTitle: teamMeta?.hackathonTitle ?? "",
        lookingFor: teamMeta?.team.lookingFor ?? [],
        intro: teamMeta?.team.intro ?? "",
      };

      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "recruit", query: q, candidates, teamInfo }),
      });

      if (!res.ok) throw new Error("API 요청 실패");

      const data = await res.json();
      const matches: RecruitMatch[] = (data.matches ?? []).map((m: RecruitMatch) => {
        // 후보자의 스킬/관심분야 추가
        const user = allUsers.find((u) => u.nickname === m.nickname);
        return { ...m, skills: user?.skills, interests: user?.interests };
      });

      setRecruitResults((prev) => ({ ...prev, [teamCode]: matches }));
    } catch {
      setRecruitError((prev) => ({ ...prev, [teamCode]: "AI 검색에 실패했습니다." }));
      setRecruitResults((prev) => ({ ...prev, [teamCode]: [] }));
    } finally {
      setRecruitLoading(null);
    }
  }

  function handleScout(targetNickname: string, teamCode: string) {
    if (!profile) return;
    const teamMeta = myTeams.find((t) => t.team.teamCode === teamCode);
    if (!teamMeta) return;

    addNotification(targetNickname, {
      id: `scout-${teamCode}-${Date.now()}`,
      type: "scout_request",
      fromNickname: profile.nickname,
      teamCode,
      teamName: teamMeta.team.name,
      hackathonSlug: teamMeta.membership.hackathonSlug,
      message: `${profile.nickname}님이 ${teamMeta.team.name} 팀에 합류를 요청했습니다.`,
      createdAt: new Date().toISOString(),
      read: false,
    });

    setSentScouts((prev) => new Set(prev).add(`${targetNickname}-${teamCode}`));
    toast.success(`${targetNickname}님에게 스카웃 요청을 보냈습니다!`);
  }

  if (!profile) {
    return (
      <LoginRequiredDialog
        open={showLoginDialog}
        onOpenChange={(open) => {
          setShowLoginDialog(open);
          if (!open) router.replace("/");
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">내 팀</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          참여 중인 팀을 관리하세요
        </p>
      </div>

      {myTeams.length === 0 ? (
        <EmptyState
          icon={<UsersIcon />}
          title="아직 참여한 팀이 없습니다"
          description="Camp에서 팀을 찾거나 만들어보세요!"
          action={{
            label: "Camp로 이동",
            onClick: () => router.push("/camp"),
          }}
        />
      ) : (
        <div className="space-y-6">
          {myTeams.map(({ membership, team, hackathonTitle, members }, idx) => {
            const isLeader = membership.role === "leader";
            const isEditing = editingTeamCode === team.teamCode;

            return (
              <Card
                key={`${team.teamCode}-${membership.hackathonSlug}-${idx}`}
                className={`animate-card ${
                  isLeader ? "ring-2 ring-amber-500/30 bg-amber-500/5" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {isLeader ? (
                      <CrownIcon className="size-5 text-amber-500" />
                    ) : (
                      <UserIcon className="size-5 text-primary" />
                    )}
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <Badge variant="outline" className="ml-auto">
                      {isLeader ? "팀장" : "팀원"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link
                      href={`/hackathons/${membership.hackathonSlug}`}
                      className="hover:text-primary hover:underline"
                    >
                      {hackathonTitle}
                    </Link>
                    <span>·</span>
                    <span>
                      {team.memberCount}/{team.maxTeamSize}명
                    </span>
                    <span>·</span>
                    <Badge
                      variant={team.isOpen ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {team.isOpen ? "모집 중" : "모집 마감"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* 팀원 목록 */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      팀원 ({members.length}명)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {members.map((m) => (
                        <div
                          key={m.nickname}
                          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm"
                        >
                          {m.role === "leader" ? (
                            <CrownIcon className="size-3 text-amber-500" />
                          ) : (
                            <UserIcon className="size-3 text-muted-foreground" />
                          )}
                          {m.nickname}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 팀 소개 */}
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">팀 소개</Label>
                        <Textarea
                          value={editIntro}
                          onChange={(e) => setEditIntro(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">
                          모집 분야 (쉼표로 구분)
                        </Label>
                        <Input
                          value={editLookingFor}
                          onChange={(e) => setEditLookingFor(e.target.value)}
                          placeholder="Frontend, Backend, Designer"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {team.intro && (
                        <p className="text-sm text-muted-foreground">
                          {team.intro}
                        </p>
                      )}
                      {team.lookingFor.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-xs text-muted-foreground self-center">
                            모집 중:
                          </span>
                          {team.lookingFor.map((role) => (
                            <Badge key={role} variant="outline">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* AI 팀원 추천 (팀장만) */}
                  {isLeader && !isEditing && (
                    <div className="pt-3 border-t border-border space-y-3">
                      <div className="flex items-center gap-1.5">
                        <SparklesIcon className="size-4 text-primary" />
                        <span className="text-sm font-medium">AI 팀원 추천</span>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="예: Python 백엔드 경험자 구해요"
                          value={recruitQuery[team.teamCode] ?? ""}
                          onChange={(e) =>
                            setRecruitQuery((prev) => ({
                              ...prev,
                              [team.teamCode]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleRecruit(team.teamCode, membership.hackathonSlug);
                          }}
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            handleRecruit(team.teamCode, membership.hackathonSlug)
                          }
                          disabled={recruitLoading === team.teamCode}
                        >
                          {recruitLoading === team.teamCode ? (
                            <Loader2Icon className="size-4 animate-spin" />
                          ) : (
                            <SearchIcon className="size-4 mr-1" />
                          )}
                          {recruitLoading === team.teamCode ? "검색 중..." : "추천받기"}
                        </Button>
                      </div>

                      {recruitError[team.teamCode] && (
                        <p className="text-sm text-destructive">
                          {recruitError[team.teamCode]}
                        </p>
                      )}

                      {recruitResults[team.teamCode]?.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs text-muted-foreground">
                            추천 결과
                          </span>
                          {recruitResults[team.teamCode].map((m) => {
                            const scoutKey = `${m.nickname}-${team.teamCode}`;
                            const alreadySent = sentScouts.has(scoutKey);
                            return (
                              <div
                                key={m.nickname}
                                className="rounded-lg border border-border p-3 space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm">
                                    {m.nickname}
                                  </span>
                                  <Badge variant="secondary" className="text-xs">
                                    {Math.round(m.score * 100)}%
                                  </Badge>
                                </div>
                                {m.skills && m.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {m.skills.map((s) => (
                                      <Badge
                                        key={s}
                                        variant="outline"
                                        className="text-xs px-1.5 py-0"
                                      >
                                        {s}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  {m.reason}
                                </p>
                                <Button
                                  size="sm"
                                  variant={alreadySent ? "secondary" : "default"}
                                  className="w-full"
                                  disabled={alreadySent}
                                  onClick={() =>
                                    handleScout(m.nickname, team.teamCode)
                                  }
                                >
                                  {alreadySent ? "요청 완료" : "스카웃 요청"}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {recruitResults[team.teamCode]?.length === 0 &&
                        !recruitLoading &&
                        !recruitError[team.teamCode] && (
                          <p className="text-sm text-muted-foreground">
                            조건에 맞는 후보자가 없습니다.
                          </p>
                        )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="gap-2 flex-wrap">
                  {isLeader && (
                    <>
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => saveEdit(team.teamCode)}
                          >
                            <Check className="size-4 mr-1" />
                            저장
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelEdit}
                          >
                            <X className="size-4 mr-1" />
                            취소
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(team)}
                          >
                            <Pencil className="size-4 mr-1" />
                            팀 정보 수정
                          </Button>
                          <Button
                            size="sm"
                            variant={team.isOpen ? "secondary" : "default"}
                            onClick={() =>
                              toggleRecruitment(team.teamCode, team.isOpen)
                            }
                          >
                            {team.isOpen ? "모집 마감하기" : "모집 열기"}
                          </Button>
                        </>
                      )}
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleLeave(team.teamCode)}
                  >
                    <LogOut className="size-4 mr-1" />
                    팀 탈퇴
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Camp 바로가기 */}
      {myTeams.length > 0 && (
        <div className="flex justify-center">
          <Link href="/camp">
            <Button variant="outline">
              다른 팀 둘러보기
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
