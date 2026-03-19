"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Menu, X, Crown, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getUserProfile } from "@/lib/storage";
import { RoleSelectDialog } from "@/components/common/RoleSelectDialog";
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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfile(getUserProfile());
  }, []);

  // Re-read profile when dialog closes
  const handleDialogClose = useCallback(() => {
    setRoleDialogOpen(false);
    setProfile(getUserProfile());
  }, []);

  // Listen for storage changes (profile set from page.tsx dialog)
  useEffect(() => {
    const handleStorage = () => {
      setProfile(getUserProfile());
    };
    window.addEventListener("storage", handleStorage);

    // Also poll briefly after mount to catch same-tab changes
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const roleMeta = profile ? ROLE_META[profile.role] : null;
  const RoleIcon = roleMeta?.icon;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <nav className="container mx-auto flex h-14 items-center justify-between px-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-primary"
          >
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

          {/* Right side: role badge + theme toggle + mobile menu */}
          <div className="flex items-center gap-1">
            {/* Role badge */}
            {mounted && (
              <button
                type="button"
                onClick={() => setRoleDialogOpen(true)}
                className="cursor-pointer"
              >
                <Badge
                  variant={profile ? "secondary" : "outline"}
                  className="gap-1 px-2.5 py-1"
                >
                  {RoleIcon && <RoleIcon className="size-3" />}
                  <span className="text-xs">
                    {roleMeta?.label ?? "역할 선택"}
                  </span>
                </Badge>
              </button>
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
              {mobileOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
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
                    variant={
                      pathname.startsWith(link.href) ? "secondary" : "ghost"
                    }
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

      {/* Role select dialog (triggered from navbar) */}
      {roleDialogOpen && (
        <RoleSelectDialog forceOpen={true} onClose={handleDialogClose} />
      )}
    </>
  );
}
