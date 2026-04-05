"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2Icon } from "lucide-react";
import { toast } from "sonner";
import { addSubmission, getUserProfile, updateLeaderboardOnSubmit } from "@/lib/storage";
import type { SubmitSection } from "@/lib/types";

interface SubmitTabProps {
  data: SubmitSection;
  hackathonSlug: string;
}

export function SubmitTab({ data, hackathonSlug }: SubmitTabProps) {
  const [title, setTitle] = useState("");
  const [artifactUrl, setArtifactUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [stepValues, setStepValues] = useState<Record<string, string>>({});

  // 유저 팀 정보
  const [teamCode, setTeamCode] = useState("unknown");
  const [teamName, setTeamName] = useState("Unknown Team");
  const [hasTeam, setHasTeam] = useState(false);

  useEffect(() => {
    const profile = getUserProfile();
    if (profile?.teams) {
      const membership = profile.teams.find((t) => t.hackathonSlug === hackathonSlug);
      if (membership) {
        setTeamCode(membership.teamCode);
        setTeamName(membership.teamName);
        setHasTeam(true);
      }
    }
  }, [hackathonSlug]);

  const handleSubmit = () => {
    setError("");

    if (!hasTeam) {
      setError("이 해커톤에 소속된 팀이 없습니다. Camp에서 팀에 참여해주세요.");
      return;
    }

    let artifacts: { webUrl?: string; pdfUrl?: string; planTitle?: string } | undefined;

    if (data.submissionItems && data.submissionItems.length > 0) {
      // 단계별 제출
      const missing = data.submissionItems.filter(
        (item) => !stepValues[item.key]?.trim()
      );
      if (missing.length > 0) {
        setError(`${missing.map((m) => m.title).join(", ")} 항목을 입력해주세요.`);
        return;
      }

      // artifacts 매핑
      artifacts = {};
      data.submissionItems.forEach((item) => {
        if (item.format === "url") artifacts!.webUrl = stepValues[item.key];
        if (item.format === "pdf_url") artifacts!.pdfUrl = stepValues[item.key];
        if (item.format === "text") artifacts!.planTitle = stepValues[item.key];
      });

      data.submissionItems.forEach((item) => {
        addSubmission({
          id: `${Date.now()}-${item.key}`,
          hackathonSlug,
          teamCode,
          teamName,
          artifactType: item.format,
          artifactUrl: stepValues[item.key],
          notes,
          submittedAt: new Date().toISOString(),
        });
      });
    } else {
      // 단일 제출
      if (!title.trim()) {
        setError("제목을 입력해주세요.");
        return;
      }
      if (!artifactUrl.trim()) {
        setError("파일 URL을 입력해주세요.");
        return;
      }

      artifacts = { webUrl: artifactUrl };

      addSubmission({
        id: `${Date.now()}`,
        hackathonSlug,
        teamCode,
        teamName,
        artifactType: data.allowedArtifactTypes[0] ?? "url",
        artifactUrl,
        artifactText: title,
        notes: notes || undefined,
        submittedAt: new Date().toISOString(),
      });
    }

    // 리더보드 갱신
    updateLeaderboardOnSubmit(hackathonSlug, teamName, artifacts);

    toast.success("제출 완료! 리더보드에 반영됩니다.");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <CheckCircle2Icon className="size-16 text-green-500 animate-scale-in" />
        <h3 className="text-lg font-semibold">제출 완료!</h3>
        <p className="text-sm text-muted-foreground">
          제출이 성공적으로 완료되었습니다. 리더보드에 반영됩니다.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSubmitted(false);
            setTitle("");
            setArtifactUrl("");
            setNotes("");
            setStepValues({});
          }}
        >
          추가 제출하기
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 팀 정보 */}
      {hasTeam ? (
        <div className="rounded-md bg-muted/50 p-3 text-sm">
          제출 팀: <span className="font-semibold">{teamName}</span>
        </div>
      ) : (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          이 해커톤에 소속된 팀이 없습니다. Camp에서 팀에 참여한 후 제출해주세요.
        </div>
      )}

      {/* 가이드 */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">제출 안내</h3>
        <ul className="space-y-2">
          {data.guide.map((text, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-0.5 shrink-0 text-primary">&#8226;</span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* 허용 형식 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">허용 형식:</span>
        {data.allowedArtifactTypes.map((type) => (
          <Badge key={type} variant="secondary">
            {type}
          </Badge>
        ))}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* 제출 폼 */}
      {data.submissionItems && data.submissionItems.length > 0 ? (
        <div className="space-y-4">
          {data.submissionItems.map((item, i) => (
            <Card key={item.key}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {i + 1}
                  </span>
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor={`step-${item.key}`}>
                    {item.format === "url" || item.format === "pdf_url"
                      ? "URL"
                      : "내용"}
                  </Label>
                  <Input
                    id={`step-${item.key}`}
                    placeholder={
                      item.format === "url"
                        ? "https://..."
                        : item.format === "pdf_url"
                          ? "PDF URL을 입력하세요"
                          : "내용을 입력하세요"
                    }
                    value={stepValues[item.key] ?? ""}
                    onChange={(e) =>
                      setStepValues((prev) => ({
                        ...prev,
                        [item.key]: e.target.value,
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    형식: {item.format}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="space-y-2">
            <Label htmlFor="notes">메모 (선택)</Label>
            <Textarea
              id="notes"
              placeholder="추가 메모를 입력하세요..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={!hasTeam}>
            제출하기
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              placeholder="제출물 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artifact">파일 / URL</Label>
            <Input
              id="artifact"
              placeholder="파일 URL 또는 경로를 입력하세요"
              value={artifactUrl}
              onChange={(e) => setArtifactUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes-single">메모 (선택)</Label>
            <Textarea
              id="notes-single"
              placeholder="추가 메모를 입력하세요..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={!hasTeam}>
            제출하기
          </Button>
        </div>
      )}
    </div>
  );
}
