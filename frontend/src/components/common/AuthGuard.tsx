"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUserProfile } from "@/lib/storage";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const profile = getUserProfile();
    const isSignup = pathname === "/signup";

    // 프로필 없거나 구버전(teams 배열 없는) 프로필이면 재로그인
    if ((!profile?.nickname || !("teams" in profile)) && !isSignup) {
      if (typeof window !== "undefined") localStorage.removeItem("userProfile");
      router.replace("/signup");
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) return null;

  return <>{children}</>;
}
