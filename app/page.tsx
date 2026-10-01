"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuthStore } from "@/stores/use-auth-store";

export default function Page() {
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/feed");
    } else {
      router.replace("/login");
    }

    setIsCheckingAuth(false);
  }, [isAuthenticated, router]);

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">Loading Connct.dev...</p>
        </div>
      </main>
    );
  }

  return null;
}
