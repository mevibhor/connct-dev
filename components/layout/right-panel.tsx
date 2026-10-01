"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { UserPlus, TrendingUp } from "lucide-react";

import Link from "next/link";

import { useAuthStore } from "@/stores/use-auth-store";
import { useQuery } from "@tanstack/react-query";

import { User, Project } from "@/types/models";

interface DeveloperWithProjectCount extends User {
  projectCount: number;
}

interface DevelopersResponse {
  success: boolean;
  data: DeveloperWithProjectCount[];
}

interface ProjectsResponse {
  success: boolean;
  data: Project[];
}

async function fetchDevelopers(): Promise<DeveloperWithProjectCount[]> {
  const response = await fetch("/api/developers");

  if (!response.ok) {
    throw new Error("Failed to fetch developers");
  }

  const result: DevelopersResponse = await response.json();

  if (!result.success) {
    throw new Error("Failed to fetch developers");
  }

  return result.data;
}

async function fetchProjects(): Promise<Project[]> {
  const response = await fetch("/api/projects?page=1");

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  const result: ProjectsResponse = await response.json();

  if (!result.success) {
    throw new Error("Failed to fetch projects");
  }

  return result.data;
}

export function RightPanel() {
  const currentUser = useAuthStore((state) => state.user);

  const { data: developers = [] } = useQuery({
    queryKey: ["right-panel", "developers"],
    queryFn: fetchDevelopers,
    staleTime: 1000 * 60 * 5,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["right-panel", "projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 5,
  });

  const suggestedDevelopers = developers
    .filter((developer) => developer.id !== currentUser?.id)
    .sort((a, b) => b.projectCount - a.projectCount)
    .slice(0, 5);

  const techUsage = new Map<string, number>();

  projects.forEach((project) => {
    project.techStack.forEach((tech) => {
      const normalizedTech = tech.trim();

      if (!normalizedTech) {
        return;
      }

      const existingCount = techUsage.get(normalizedTech.toLowerCase()) || 0;

      techUsage.set(normalizedTech.toLowerCase(), existingCount + 1);
    });
  });

  const trendingTech = Array.from(techUsage.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tech]) => {
      const originalTech = projects
        .flatMap((project) => project.techStack)
        .find((item) => item.toLowerCase() === tech);

      return originalTech || tech;
    });

  return (
    <div className="space-y-4">
      {/* Suggested Developers */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <UserPlus className="h-4 w-4 text-primary" />
            Top Developers
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {suggestedDevelopers.length > 0 ? (
            suggestedDevelopers.map((developer) => (
              <div
                key={developer.id}
                className="flex items-center justify-between gap-3"
              >
                <Link
                  href={`/profile/${developer.id}`}
                  className="group flex min-w-0 items-center gap-3"
                >
                  <Avatar className="h-9 w-9 shrink-0 border border-border">
                    <AvatarImage src={developer.avatar} alt={developer.name} />

                    <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                      {developer.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                      {developer.name}
                    </span>

                    <span className="max-w-30 truncate text-xs text-muted-foreground">
                      {developer.profession || "Developer"}
                    </span>
                  </div>
                </Link>

                <Link href={`/profile/${developer.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 shrink-0 cursor-pointer border-border px-2 text-xs hover:bg-muted"
                  >
                    Profile
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No developers available.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Trending Tech */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            Trending Tech
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {trendingTech.length > 0 ? (
            trendingTech.map((tech, index) => (
              <div key={tech} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>

                <span className="text-sm font-medium text-foreground">
                  {tech}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No tech trends available.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Footer Links */}
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
