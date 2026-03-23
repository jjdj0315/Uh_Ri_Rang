"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import {
  Sun,
  Moon,
  Menu,
  X,
  Crown,
  Users,
  User,
  Pencil,
  LogOut,
  LogIn,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUserProfile, setUserProfile, clearUserProfile, leaveTeam } from "@/lib/storage";
import type { UserProfile } from "@/lib/types";

const navLinks = [
  { href: "/hackathons", label: "Hackathons" },
  { href: "/camp", label: "Camp" },
  { href: "/rankings", label: "Rankings" },
];

const ROLE_META: Record<
  UserProfile["role"],
  { label: string; icon: typeof Crown }
> = {
  leader: { label: "팀장", icon: Crown },
  member: { label: "팀원", icon: Users },
  unaffiliated: { label: "무소속", icon: User },
};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setProfile(getUserProfile());
  }, []);

  // Listen for storage changes + polling
  useEffect(() => {
    const handleStorage = () => setProfile(getUserProfile());
    window.addEventListener("storage", handleStorage);

    const interval = setInterval(() => {
      const current = getUserProfile();
      setProfile((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(current)) return current;
        return prev;
      });
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Close popover on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    };
    if (popoverOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [popoverOpen]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleLeaveTeam = () => {
    if (!profile?.teamCode) return;
    leaveTeam(profile.teamCode);
    const updated: UserProfile = {
      nickname: profile.nickname,
      skills: profile.skills,
      interests: profile.interests,
      role: "unaffiliated",
    };
    setUserProfile(updated);
    setProfile(updated);
    setPopoverOpen(false);
  };

  const handleLogout = () => {
    clearUserProfile();
    setPopoverOpen(false);
    router.push("/signup");
  };

  const roleMeta = profile ? ROLE_META[profile.role] : null;
  const RoleIcon = roleMeta?.icon;
  const isInTeam = profile?.role === "leader" || profile?.role === "member";
  const isGuest = profile?.nickname === "게스트";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-primary">
          DAKER
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={pathname.startsWith(link.href) ? "secondary" : "ghost"}
                size="sm"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {/* Profile badge + popover */}
          {mounted && profile && (
            <div className="relative" ref={popoverRef}>
              <button
                type="button"
                onClick={() => setPopoverOpen(!popoverOpen)}
                className="cursor-pointer"
              >
                <Badge variant="secondary" className="gap-1 px-2.5 py-1">
                  {RoleIcon && <RoleIcon className="size-3" />}
                  <span className="text-xs">
                    {profile.nickname}
                  </span>
                </Badge>
              </button>

              {popoverOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-lg border border-border bg-card p-4 shadow-lg z-50">
                  {/* Header */}
                  <div className="mb-3">
                    <p className="font-semibold">{profile.nickname}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="gap-1 text-xs">
                        {RoleIcon && <RoleIcon className="size-3" />}
                        {roleMeta?.label}
                      </Badge>
                      {profile.teamName && (
                        <span className="text-xs text-muted-foreground">
                          {profile.teamName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Skills */}
                  {profile.skills?.length > 0 && (
                    <div className="mb-3">
                      <p className="mb-1 text-xs text-muted-foreground">기술 스택</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.skills.map((s) => (
                          <Badge key={s} variant="outline" className="text-xs px-1.5 py-0">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="border-t border-border pt-2 space-y-1">
                    {isGuest ? (
                      <>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors"
                          onClick={() => {
                            clearUserProfile();
                            setPopoverOpen(false);
                            router.push("/signup");
                          }}
                        >
                          <LogIn className="size-3.5" />
                          로그인
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors"
                          onClick={() => {
                            clearUserProfile();
                            setPopoverOpen(false);
                            router.push("/signup");
                          }}
                        >
                          <UserPlus className="size-3.5" />
                          회원가입
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors"
                          onClick={() => {
                            setPopoverOpen(false);
                            router.push("/signup?edit=true");
                          }}
                        >
                          <Pencil className="size-3.5" />
                          프로필 수정
                        </button>
                        {isInTeam && (
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors text-destructive"
                            onClick={handleLeaveTeam}
                          >
                            <UserMinus className="size-3.5" />
                            팀 탈퇴
                          </button>
                        )}
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors text-muted-foreground"
                          onClick={handleLogout}
                        >
                          <LogOut className="size-3.5" />
                          로그아웃
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>
          )}

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
              >
                <Button
                  variant={pathname.startsWith(link.href) ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
