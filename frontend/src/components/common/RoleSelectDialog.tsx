"use client";

import { useState, useEffect, useCallback } from "react";
import { Crown, Users, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  getUserProfile,
  setUserProfile,
  getHackathons,
  getTeams,
} from "@/lib/storage";
import type { UserProfile } from "@/lib/types";
import type { Hackathon, Team } from "@/lib/types";
import { cn } from "@/lib/utils";

type Role = UserProfile["role"];

const ROLE_OPTIONS: {
  role: Role;
  icon: typeof Crown;
  label: string;
  description: string;
}[] = [
  {
    role: "leader",
    icon: Crown,
    label: "팀장",
    description: "팀을 이끌고 팀원을 모집합니다",
  },
  {
    role: "member",
    icon: Users,
    label: "팀원",
    description: "팀에 소속되어 함께 참가합니다",
  },
  {
    role: "unaffiliated",
    icon: User,
    label: "무소속",
    description: "아직 팀이 없어요. 팀을 찾고 있습니다",
  },
];

interface RoleSelectDialogProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function RoleSelectDialog({ forceOpen, onClose }: RoleSelectDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedHackathon, setSelectedHackathon] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  // Check if profile exists on mount
  useEffect(() => {
    const profile = getUserProfile();
    if (!profile) {
      setOpen(true);
    }
  }, []);

  // Handle forceOpen from parent
  useEffect(() => {
    if (forceOpen) {
      // Reset state when reopening
      setStep(1);
      setSelectedRole(null);
      setSelectedHackathon("");
      setSelectedTeam("");
      setOpen(true);
    }
  }, [forceOpen]);

  // Load hackathons when entering step 2
  useEffect(() => {
    if (step === 2) {
      const all = getHackathons();
      const active = all.filter(
        (h) => h.status === "ongoing" || h.status === "upcoming"
      );
      setHackathons(active);
    }
  }, [step]);

  // Load teams when hackathon is selected
  useEffect(() => {
    if (selectedHackathon) {
      const hackathonTeams = getTeams(selectedHackathon);
      setTeams(hackathonTeams);
      setSelectedTeam("");
    }
  }, [selectedHackathon]);

  const handleNext = useCallback(() => {
    if (step === 1 && selectedRole) {
      if (selectedRole === "unaffiliated") {
        // Save and close
        setUserProfile({ role: "unaffiliated" });
        setOpen(false);
        onClose?.();
      } else {
        setStep(2);
      }
    } else if (step === 2 && selectedHackathon) {
      setStep(3);
    }
  }, [step, selectedRole, selectedHackathon, onClose]);

  const handleComplete = useCallback(() => {
    if (!selectedRole || !selectedHackathon || !selectedTeam) return;

    const team = teams.find((t) => t.teamCode === selectedTeam);
    const profile: UserProfile = {
      role: selectedRole,
      hackathonSlug: selectedHackathon,
      teamCode: selectedTeam,
      teamName: team?.name,
    };
    setUserProfile(profile);
    setOpen(false);
    onClose?.();
  }, [selectedRole, selectedHackathon, selectedTeam, teams, onClose]);

  const handleOpenChange = (nextOpen: boolean) => {
    // Only allow closing if user already has a profile
    if (!nextOpen) {
      const profile = getUserProfile();
      if (profile) {
        setOpen(false);
        onClose?.();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={!!getUserProfile()}
        className="sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "역할을 선택하세요"}
            {step === 2 && "해커톤을 선택하세요"}
            {step === 3 && "팀을 선택하세요"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "DAKER 플랫폼에서의 역할을 선택해주세요."}
            {step === 2 && "참가 중인 해커톤을 선택해주세요."}
            {step === 3 && "소속 팀을 선택해주세요."}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Role selection */}
        {step === 1 && (
          <div className="grid gap-3">
            {ROLE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedRole === option.role;
              return (
                <button
                  key={option.role}
                  type="button"
                  onClick={() => setSelectedRole(option.role)}
                  className={cn(
                    "flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{option.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Hackathon selection */}
        {step === 2 && (
          <div className="space-y-3">
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
        )}

        {/* Step 3: Team selection */}
        {step === 3 && (
          <div className="space-y-3">
            {teams.length > 0 ? (
              <Select value={selectedTeam} onValueChange={(v) => setSelectedTeam(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="팀을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.teamCode} value={t.teamCode}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground">
                해당 해커톤에 등록된 팀이 없습니다.
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
            >
              이전
            </Button>
          )}
          {step < 3 && (
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && !selectedRole) ||
                (step === 2 && !selectedHackathon)
              }
            >
              {step === 1 && selectedRole === "unaffiliated"
                ? "완료"
                : "다음"}
            </Button>
          )}
          {step === 3 && (
            <Button
              onClick={handleComplete}
              disabled={!selectedTeam}
            >
              완료
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
