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

import { useBookmarks } from "@/hooks/use-bookmarks";
import { CollaborationRequestModal } from "@/components/shared/collab-request-modal";

import { Bookmark, MessageCircle, MoreHorizontal, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { useAuthStore } from "@/stores/use-auth-store";
import { toast } from "@/hooks/use-toast";

import { Project, User } from "@/types/models";

import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ProjectWithAuthor extends Project {
  author?: User;
}

interface ProjectCardProps {
  project: ProjectWithAuthor;
}

async function fetchInquiryProjectIds(userId: string): Promise<string[]> {
  const response = await fetch(
    `/api/collaborate?userId=${encodeURIComponent(userId)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch inquiry status");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch inquiry status");
  }

  return result.data;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { bookmarkedIds, toggleBookmark } = useBookmarks();

  const user = useAuthStore((state) => state.user);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const author = project.author;

  const { data: inquiryProjectIds = [] } = useQuery({
    queryKey: ["inquiries", user?.id],
    queryFn: () => fetchInquiryProjectIds(user!.id),
    enabled: !!user?.id && user.id !== project.authorId,
    staleTime: 1000 * 60 * 5,
  });

  if (!author) {
    return null;
  }

  const isBookmarked = bookmarkedIds.includes(project.id);

  const isOwner = user?.id === project.authorId;

  const hasInquired = inquiryProjectIds.includes(project.id);

  const handleGuestClick = (action: string) => {
    if (!isAuthenticated) {
      toast({
        title: `Please login to ${action.toLowerCase()}`,
        type: "info",
      });
    }
  };

  const handleDelete = async () => {
    if (!user?.id || !isOwner) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/projects?projectId=${encodeURIComponent(
          project.id,
        )}&userId=${encodeURIComponent(user.id)}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete project");
      }

      toast({
        title: "Project deleted successfully",
        type: "success",
      });

      await queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["profile", user.id],
      });

      await queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });
    } catch (error) {
      toast({
        title:
          error instanceof Error ? error.message : "Failed to delete project",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  function formatProjectDate(dateString: string) {
    const date = new Date(dateString);
    const diffHours = Math.floor(
      (Date.now() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffHours < 1) return "now";
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

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
          <div className="flex items-center gap-1">
            {isOwner ? (
              <Button
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                className="gap-2 text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />

                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            ) : hasInquired ? (
              <Button variant="ghost" size="sm" disabled className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Inquired
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  handleGuestClick("collaborate");

                  if (isAuthenticated) {
                    setIsModalOpen(true);
                  }
                }}
              >
                <MessageCircle className="h-4 w-4" />
                Inquire
              </Button>
            )}
          </div>

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

              if (isAuthenticated) {
                toggleBookmark(project.id);
              }
            }}
          >
            <Bookmark
              className={cn("h-4 w-4", isBookmarked && "fill-current")}
            />

            {project.bookmarkCount}
          </Button>

          <span className="text-xs text-muted-foreground">
            {formatProjectDate(project.createdAt)}{" "}
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
