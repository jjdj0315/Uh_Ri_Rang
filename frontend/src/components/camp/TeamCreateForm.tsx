"use client";

import { useState } from "react";
import type { Hackathon, Team } from "@/lib/types";
import { addTeam, setUserProfile } from "@/lib/storage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hackathonSlug?: string;
  hackathons: Hackathon[];
  onCreated: () => void;
}

export function TeamCreateForm({
  open,
  onOpenChange,
  hackathonSlug,
  hackathons,
  onCreated,
}: TeamCreateFormProps) {
  const [name, setName] = useState("");
  const [intro, setIntro] = useState("");
  const [selectedHackathon, setSelectedHackathon] = useState(
    hackathonSlug ?? ""
  );
  const [lookingFor, setLookingFor] = useState("");
  const [maxMembers, setMaxMembers] = useState("5");
  const [contactType, setContactType] = useState<"link" | "email">("link");
  const [contactUrl, setContactUrl] = useState("");
  const [error, setError] = useState("");

  function resetForm() {
    setName("");
    setIntro("");
    setSelectedHackathon(hackathonSlug ?? "");
    setLookingFor("");
    setMaxMembers("5");
    setContactType("link");
    setContactUrl("");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError("팀 이름을 입력해주세요.");
      return;
    }
    if (!selectedHackathon) {
      setError("해커톤을 선택해주세요.");
      return;
    }
    if (!contactUrl.trim()) {
      setError("연락처를 입력해주세요.");
      return;
    }

    const roles = lookingFor
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const team: Team = {
      teamCode: "T-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
      hackathonSlug: selectedHackathon,
      name: name.trim(),
      isOpen: true,
      memberCount: 1,
      maxTeamSize: parseInt(maxMembers, 10),
      lookingFor: roles,
      intro: intro.trim(),
      contact: {
        type: contactType,
        url: contactUrl.trim(),
      },
      createdAt: new Date().toISOString(),
    };

    addTeam(team);

    // 팀 생성 후 자동으로 팀장 역할 전환
    setUserProfile({
      role: "leader",
      hackathonSlug: selectedHackathon,
      teamCode: team.teamCode,
      teamName: team.name,
    });

    resetForm();
    onOpenChange(false);
    onCreated();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>팀 만들기</DialogTitle>
          <DialogDescription>
            새로운 팀을 만들고 팀원을 모집하세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 팀 이름 */}
          <div className="space-y-1.5">
            <Label htmlFor="team-name">
              팀 이름 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="team-name"
              placeholder="팀 이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* 소개 */}
          <div className="space-y-1.5">
            <Label htmlFor="team-intro">소개</Label>
            <Textarea
              id="team-intro"
              placeholder="팀 소개를 입력하세요"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
            />
          </div>

          {/* 해커톤 선택 */}
          <div className="space-y-1.5">
            <Label>
              해커톤 <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedHackathon}
              onValueChange={(v) => setSelectedHackathon(v ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="해커톤을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {hackathons.map((h) => (
                  <SelectItem key={h.slug} value={h.slug}>
                    {h.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 모집 분야 */}
          <div className="space-y-1.5">
            <Label htmlFor="looking-for">모집 분야</Label>
            <Input
              id="looking-for"
              placeholder="예: Frontend, Backend, Designer (쉼표 구분)"
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
            />
          </div>

          {/* 최대 인원 */}
          <div className="space-y-1.5">
            <Label>최대 인원</Label>
            <Select value={maxMembers} onValueChange={(v) => setMaxMembers(v ?? "5")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}명
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 연락 방법 */}
          <div className="space-y-1.5">
            <Label>연락 방법</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="contactType"
                  value="link"
                  checked={contactType === "link"}
                  onChange={() => setContactType("link")}
                  className="accent-primary"
                />
                오픈카톡
              </label>
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="contactType"
                  value="email"
                  checked={contactType === "email"}
                  onChange={() => setContactType("email")}
                  className="accent-primary"
                />
                이메일
              </label>
            </div>
          </div>

          {/* 연락처 URL */}
          <div className="space-y-1.5">
            <Label htmlFor="contact-url">
              연락처 URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact-url"
              placeholder={
                contactType === "link"
                  ? "https://open.kakao.com/o/..."
                  : "mailto:example@email.com"
              }
              value={contactUrl}
              onChange={(e) => setContactUrl(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter>
            <Button type="submit">팀 생성</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
