"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { AuthGuard } from "@/components/common/AuthGuard";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/signup";

  return (
    <AuthGuard>
      {!hideNavbar && <Navbar />}
      <main className={hideNavbar ? "" : "container mx-auto px-4 py-8"}>
        {children}
      </main>
    </AuthGuard>
  );
}
