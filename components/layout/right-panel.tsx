"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUsers } from "@/lib/mock-data";
import { useAuthStore } from "@/stores/use-auth-store";
import { UserPlus, TrendingUp } from "lucide-react";
import Link from "next/link";

export function RightPanel() {
  const currentUser = useAuthStore((state) => state.user);

  // Filter out the currently logged-in user from the suggestions
  const suggestedDevelopers = mockUsers.filter((u) => u.id !== currentUser?.id);

  const trendingTech = [
    { name: "Next.js 15", posts: "12.5k" },
    { name: "Tailwind v4", posts: "8.2k" },
    { name: "React Server Components", posts: "5.1k" },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Suggested Developers Card */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <UserPlus className="h-4 w-4 text-primary" />
            Suggested Developers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedDevelopers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <Link
                href={`/profile/${user.id}`}
                className="group flex items-center gap-3"
              >
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    {user.name}
                  </span>
                  <span className="max-w-30 truncate text-xs text-muted-foreground">
                    {user.profession || "Developer"}
                  </span>
                </div>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="h-7 border-border px-2 text-xs hover:bg-muted"
              >
                Connect
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 2. Trending Tech Card */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            Trending Tech
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTech.map((tech) => (
            <div key={tech.name} className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {tech.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {tech.posts} posts
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-primary"
              >
                View
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 3. Footer Links */}
      <div className="space-x-2 px-2 text-xs text-muted-foreground">
        <Link href="#" className="hover:underline">
          About
        </Link>
        <Link href="#" className="hover:underline">
          Help
        </Link>
        <Link href="#" className="hover:underline">
          Privacy
        </Link>
        <Link href="#" className="hover:underline">
          Terms
        </Link>
        <p className="pt-2">© 2026 connct-dev</p>
      </div>
    </div>
  );
}
