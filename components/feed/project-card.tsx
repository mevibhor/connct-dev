"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { mockUsers, Project } from "@/lib/mock-data";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { CollaborationRequestModal } from "@/components/shared/collab-request-modal";
import { Bookmark, MessageCircle, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/use-auth-store";
import { toast } from "@/hooks/use-toast";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const author = mockUsers.find((u) => u.id === project.authorId);
  const { bookmarkedIds, toggleBookmark } = useBookmarks();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!author) return null;
  const isBookmarked = bookmarkedIds.includes(project.id);

  const handleGuestClick = (action: string) => {
    if (!isAuthenticated) {
      toast({ title: `Please login to ${action.toLowerCase()}`, type: "info" });
    }
  };

  return (
    <>
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback className="bg-primary/10 font-medium text-primary">
                {author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {author.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {author.profession || "Developer"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-border text-xs font-normal text-muted-foreground"
            >
              {project.stage}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">
            {project.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {project.techStack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="bg-muted text-muted-foreground hover:bg-muted/80"
              >
                #{tech}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border pt-3 text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => {
              handleGuestClick("collaborate");
              if (isAuthenticated) setIsModalOpen(true);
            }}
          >
            <MessageCircle className="h-4 w-4" />
            Inquire
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2 transition-colors",
              isBookmarked
                ? "text-primary hover:text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => {
              handleGuestClick("bookmark");
              if (isAuthenticated) toggleBookmark(project.id);
            }}
          >
            <Bookmark
              className={cn("h-4 w-4", isBookmarked && "fill-current")}
            />
            {project.bookmarkCount + (isBookmarked ? 1 : 0)}
          </Button>

          <span className="text-xs text-muted-foreground">
            {project.createdAt}
          </span>
        </CardFooter>
      </Card>

      <CollaborationRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={project.id}
        projectName={project.title}
      />
    </>
  );
}
