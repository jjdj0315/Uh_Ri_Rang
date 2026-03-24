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
  Bell,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getUserProfile,
  setUserProfile,
  clearUserProfile,
  leaveTeam,
  syncProfileToAccount,
  getNotifications,
  getUnreadCount,
  removeNotification,
  joinTeam,
} from "@/lib/storage";
import type { UserProfile, Notification } from "@/lib/types";

const navLinks = [
  { href: "/hackathons", label: "Hackathons" },
  { href: "/camp", label: "Camp" },
  { href: "/myteam", label: "My Team" },
  { href: "/rankings", label: "Rankings" },
];

type RoleType = "leader" | "member" | "unaffiliated";
const ROLE_META: Record<RoleType, { label: string; icon: typeof Crown }> = {
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
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const popoverRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

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
      // 알림 카운트 업데이트
      if (current?.nickname) {
        setUnreadCount(getUnreadCount(current.nickname));
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Close popover/notif on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (popoverOpen || notifOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [popoverOpen, notifOpen]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleLeaveTeam = (teamCode: string) => {
    if (!profile) return;
    leaveTeam(teamCode);
    const updated: UserProfile = {
      ...profile,
      teams: profile.teams.filter((t) => t.teamCode !== teamCode),
    };
    setUserProfile(updated);
    syncProfileToAccount(updated);
    setProfile(updated);
    setPopoverOpen(false);
  };

  const openNotifications = () => {
    if (!profile?.nickname) return;
    setNotifications(getNotifications(profile.nickname));
    setNotifOpen(!notifOpen);
    setPopoverOpen(false);
  };

  const handleAcceptScout = (notif: Notification) => {
    if (!profile) return;
    // 팀 참여
    joinTeam(notif.teamCode);
    const updated: UserProfile = {
      ...profile,
      teams: [
        ...profile.teams,
        {
          hackathonSlug: notif.hackathonSlug,
          teamCode: notif.teamCode,
          teamName: notif.teamName,
          role: "member",
        },
      ],
    };
    setUserProfile(updated);
    syncProfileToAccount(updated);
    setProfile(updated);
    removeNotification(profile.nickname, notif.id);
    setNotifications(getNotifications(profile.nickname));
    setUnreadCount(getUnreadCount(profile.nickname));
  };

  const handleRejectScout = (notifId: string) => {
    if (!profile?.nickname) return;
    removeNotification(profile.nickname, notifId);
    setNotifications(getNotifications(profile.nickname));
    setUnreadCount(getUnreadCount(profile.nickname));
  };

  const handleLogout = () => {
    clearUserProfile();
    localStorage.removeItem("currentUserId");
    setPopoverOpen(false);
    router.push("/signup");
  };

  const hasTeams = (profile?.teams?.length ?? 0) > 0;
  const primaryRole: RoleType = hasTeams ? profile!.teams[0].role : "unaffiliated";
  const roleMeta = profile ? ROLE_META[primaryRole] : null;
  const RoleIcon = roleMeta?.icon;
  const isGuest = profile?.nickname === "게스트";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="container mx-auto flex h-14 items-center px-4">
        {/* Logo + Desktop nav links (left-aligned) */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-primary">
            DAKER
          </Link>
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
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-1">
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
                    {profile.teams.length > 0 ? (
                      <div className="mt-2 space-y-1">
                        {profile.teams.map((t) => (
                          <div key={t.teamCode} className="flex items-center gap-2">
                            <Badge variant="outline" className="gap-1 text-xs">
                              {t.role === "leader" ? <Crown className="size-3" /> : <Users className="size-3" />}
                              {t.role === "leader" ? "팀장" : "팀원"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{t.teamName}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Badge variant="outline" className="mt-1 gap-1 text-xs">
                        <User className="size-3" />
                        무소속
                      </Badge>
                    )}
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
                        {profile.teams.map((t) => (
                          <button
                            key={t.teamCode}
                            type="button"
                            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors text-destructive"
                            onClick={() => handleLeaveTeam(t.teamCode)}
                          >
                            <UserMinus className="size-3.5" />
                            {t.teamName} 탈퇴
                          </button>
                        ))}
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

          {/* Notification bell */}
          {mounted && profile && !isGuest && (
            <div className="relative" ref={notifRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={openNotifications}
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-lg border border-border bg-card shadow-lg z-50">
                  <div className="p-3 border-b border-border">
                    <span className="text-sm font-semibold">알림</span>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      알림이 없습니다
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-3 space-y-2">
                          <p className="text-sm">{n.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(n.createdAt).toLocaleDateString("ko-KR")}
                          </p>
                          {n.type === "scout_request" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => handleAcceptScout(n)}
                              >
                                <Check className="size-3.5 mr-1" />
                                수락
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleRejectScout(n.id)}
                              >
                                <X className="size-3.5 mr-1" />
                                거절
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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
