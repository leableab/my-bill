"use client";

import { AuthProvider } from "@/providers/auth-provider";
import { AuthGuard } from "@/components/auth-guard";
import { BottomNav } from "@/components/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>
        <div className="mx-auto w-full max-w-[430px] min-h-dvh relative bg-bg-primary">
          <main className="pb-24 px-4 pt-6">
            {children}
          </main>
          <BottomNav />
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}
