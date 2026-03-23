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

    if (!profile?.nickname && !isSignup) {
      router.replace("/signup");
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) return null;

  return <>{children}</>;
}
