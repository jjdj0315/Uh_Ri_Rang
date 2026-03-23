"use client";

import { useState } from "react";
import type { Team } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon, SearchIcon } from "lucide-react";

export interface AIMatch {
  teamCode: string;
  teamName: string;
  reason: string;
  score: number;
}

interface AISearchBarProps {
  teams: Team[];
  hackathonSlug?: string;
  role?: "leader" | "member" | "unaffiliated";
  skills?: string[];
  interests?: string[];
  onResults: (matches: AIMatch[]) => void;
}

export function AISearchBar({
  teams,
  hackathonSlug,
  role,
  skills,
  interests,
  onResults,
}: AISearchBarProps) {
  const isTeamMember = role === "leader" || role === "member";
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSearch() {
    if (!query.trim()) {
      setErrorMsg("검색어를 입력해주세요.");
      setStatus("idle");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          teams,
          hackathonSlug,
          role: role ?? "unaffiliated",
          skills: skills ?? [],
          interests: interests ?? [],
        }),
      });

      if (!res.ok) {
        throw new Error("API 요청에 실패했습니다.");
      }

      const data = await res.json();
      const matches: AIMatch[] = data.matches ?? [];
      onResults(matches);
      setStatus("success");
    } catch {
      setErrorMsg("AI 검색에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setStatus("error");
      onResults([]);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder={
            isTeamMember
              ? "예: Python 백엔드 경험자 찾아줘"
              : "예: React 프론트엔드 개발자가 있는 팀 찾아줘"
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setErrorMsg("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={status === "loading"}>
          {status === "loading" ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <SearchIcon className="size-4 mr-1" />
          )}
          {status === "loading"
            ? "검색 중..."
            : isTeamMember
              ? "AI로 팀원 찾기"
              : "AI로 팀 찾기"}
        </Button>
      </div>
      {errorMsg && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}
    </div>
  );
}
