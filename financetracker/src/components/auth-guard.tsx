"use client";

import { useAuth } from "@/providers/auth-provider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const publicPaths = ["/login", "/register"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && !publicPaths.includes(pathname)) {
        router.replace("/login");
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-text-secondary text-sm">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!user && !publicPaths.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
