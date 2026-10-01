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

  const handleClick = () => {
    router.push(`/profile/${user.id}`);
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
      onClick={handleClick}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 shrink-0 border border-border">
            <AvatarImage src={user.avatar} alt={user.name} />

            <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
              {user.name}
            </h3>

            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {user.profession || "Developer"}
            </p>
          </div>
        </div>

        {user.bio && (
          <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {user.bio}
          </p>
        )}

        {user.techStack && user.techStack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {user.techStack.slice(0, 5).map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="bg-muted text-xs font-normal text-muted-foreground"
              >
                {tech}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">
            {user.projectCount || 0}{" "}
            {user.projectCount === 1 ? "project" : "projects"}
          </span>

          <span className="text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            View profile →
          </span>
        </div>
      </div>
    </Card>
  );
}
