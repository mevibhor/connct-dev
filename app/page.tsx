"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/use-auth-store";

export default function Page() {
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/feed");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return null;
}
