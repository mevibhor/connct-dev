"use client";

import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { User } from "@/types/models";

interface Developer extends User {
  projectCount?: number;
}

interface DeveloperCardProps {
  user: Developer;
}

export function DeveloperCard({ user }: DeveloperCardProps) {
  const router = useRouter();

  const visibleSkills = user.techStack?.slice(0, 3) || [];

  const handleClick = () => {
    router.push(`/profile/${user.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="group cursor-pointer overflow-hidden border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        {/* Developer */}
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Avatar className="h-14 w-14 shrink-0 border border-border">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-foreground">
              {user.name}
            </h3>

            <p className="truncate text-sm text-muted-foreground">
              {user.profession || "Developer"}
            </p>
          </div>
        </div>

        {/* Top Skills */}
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          {visibleSkills.length > 0 ? (
            visibleSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="max-w-28 truncate"
              >
                {skill}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">
              No skills added
            </span>
          )}
        </div>

        {/* Projects + Profile */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border pt-3 sm:w-40 sm:flex-col sm:items-end sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
          <div className="text-left sm:text-right">
            <p className="text-lg font-semibold text-foreground">
              {user.projectCount || 0}
            </p>

            <p className="text-xs text-muted-foreground">Projects</p>
          </div>

          <span className="text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
            View profile →
          </span>
        </div>
      </div>
    </Card>
  );
}
