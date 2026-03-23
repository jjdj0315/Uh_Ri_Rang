"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, X, Plus, ChevronRight, LogIn, UserPlus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getUserProfile, setUserProfile } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/lib/types";

const SKILL_PRESETS = [
  "React",
  "Next.js",
  "TypeScript",
  "Python",
  "Node.js",
  "Django",
  "FastAPI",
  "Flutter",
  "Figma",
  "UI/UX",
  "Java",
  "Spring",
  "Go",
  "Docker",
  "AWS",
];

const INTEREST_PRESETS = [
  "Frontend",
  "Backend",
  "Design",
  "Planning",
  "AI/ML",
  "Data",
  "DevOps",
  "Mobile",
];

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";

  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loginNickname, setLoginNickname] = useState("");
  const [loginError, setLoginError] = useState("");

  const [nickname, setNickname] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const profile = getUserProfile();
    if (profile && isEdit) {
      setTab("signup");
      setNickname(profile.nickname || "");
      setSkills(profile.skills || []);
      setInterests(profile.interests || []);
    } else if (profile?.nickname && !isEdit) {
      router.replace("/");
    }
  }, [isEdit, router]);

  // --- Login ---
  const handleLogin = () => {
    if (!loginNickname.trim()) {
      setLoginError("닉네임을 입력해주세요");
      return;
    }
    const profile = getUserProfile();
    if (profile?.nickname === loginNickname.trim()) {
      router.push("/");
    } else {
      setLoginError("등록된 닉네임이 없습니다. 회원가입을 해주세요.");
    }
  };

  // --- Signup ---
  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setCustomSkill("");
    }
  };

  const handleSignup = () => {
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요");
      return;
    }
    if (skills.length === 0) {
      setError("기술 스택을 1개 이상 선택해주세요");
      return;
    }

    const existing = getUserProfile();
    const profile: UserProfile = {
      ...(isEdit && existing ? existing : {}),
      nickname: nickname.trim(),
      skills,
      interests,
      role: isEdit && existing ? existing.role : "unaffiliated",
      ...(isEdit && existing
        ? {
            hackathonSlug: existing.hackathonSlug,
            teamCode: existing.teamCode,
            teamName: existing.teamName,
          }
        : {}),
    };

    setUserProfile(profile);
    router.push("/");
  };

  const handleGuest = () => {
    const guestProfile: UserProfile = {
      nickname: "게스트",
      skills: [],
      interests: [],
      role: "unaffiliated",
    };
    setUserProfile(guestProfile);
    router.push("/");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background overflow-y-auto py-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="size-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? "프로필 수정" : "DAKER"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isEdit
              ? "프로필 정보를 수정합니다"
              : "해커톤 플랫폼에 오신 것을 환영합니다"}
          </p>
        </div>

        {/* Tabs (edit 모드일 땐 탭 숨김) */}
        {!isEdit && (
          <div className="mb-4 flex rounded-lg border border-border bg-muted/50 p-1">
            <button
              type="button"
              onClick={() => {
                setTab("login");
                setError("");
                setLoginError("");
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
                tab === "login"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LogIn className="size-4" />
              로그인
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("signup");
                setError("");
                setLoginError("");
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
                tab === "signup"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <UserPlus className="size-4" />
              회원가입
            </button>
          </div>
        )}

        {/* Login Tab */}
        {tab === "login" && !isEdit && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">로그인</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-nickname">닉네임</Label>
                <Input
                  id="login-nickname"
                  placeholder="가입 시 사용한 닉네임을 입력하세요"
                  value={loginNickname}
                  onChange={(e) => {
                    setLoginNickname(e.target.value);
                    setLoginError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                  maxLength={20}
                />
              </div>
              {loginError && (
                <p className="text-sm text-destructive font-medium">
                  {loginError}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button className="w-full" size="lg" onClick={handleLogin}>
                로그인
                <ChevronRight className="ml-1 size-4" />
              </Button>
              <p className="text-sm text-muted-foreground">
                계정이 없으신가요?{" "}
                <button
                  type="button"
                  className="text-primary font-medium hover:underline"
                  onClick={() => setTab("signup")}
                >
                  회원가입
                </button>
              </p>
            </CardFooter>
          </Card>
        )}

        {/* Signup Tab / Edit Mode */}
        {(tab === "signup" || isEdit) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isEdit ? "프로필 수정" : "회원가입"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nickname */}
              <div className="space-y-2">
                <Label htmlFor="nickname">
                  닉네임 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nickname"
                  placeholder="해커톤에서 사용할 닉네임"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setError("");
                  }}
                  maxLength={20}
                />
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <Label>
                  기술 스택 <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {SKILL_PRESETS.map((skill) => (
                    <Badge
                      key={skill}
                      variant={skills.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer select-none transition-colors"
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Custom skills */}
                {skills
                  .filter((s) => !SKILL_PRESETS.includes(s))
                  .map((s) => (
                    <Badge
                      key={s}
                      variant="default"
                      className="mr-1 cursor-pointer"
                      onClick={() => toggleSkill(s)}
                    >
                      {s}
                      <X className="ml-1 size-3" />
                    </Badge>
                  ))}

                <div className="flex gap-2">
                  <Input
                    placeholder="직접 입력"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomSkill();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addCustomSkill}
                    disabled={!customSkill.trim()}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <Label>관심 분야</Label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_PRESETS.map((interest) => (
                    <Badge
                      key={interest}
                      variant={
                        interests.includes(interest) ? "default" : "outline"
                      }
                      className="cursor-pointer select-none transition-colors"
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button className="w-full" size="lg" onClick={handleSignup}>
                {isEdit ? "저장하기" : "가입하기"}
                <ChevronRight className="ml-1 size-4" />
              </Button>
              {isEdit ? (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => router.back()}
                >
                  취소
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  이미 계정이 있으신가요?{" "}
                  <button
                    type="button"
                    className="text-primary font-medium hover:underline"
                    onClick={() => setTab("login")}
                  >
                    로그인
                  </button>
                </p>
              )}
            </CardFooter>
          </Card>
        )}

        {/* Guest entry */}
        {!isEdit && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleGuest}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Eye className="size-4" />
              게스트로 둘러보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
