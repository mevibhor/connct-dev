"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/models";
import { useAuthStore } from "@/stores/use-auth-store";
import { Settings, Bookmark, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProfileSection = "posts" | "saved" | "settings";

interface ProfileHeaderProps {
  user: User;
  projectCount: number;
  activeSection: ProfileSection;
  onSectionChange: (section: ProfileSection) => void;
}

export function ProfileHeader({
  user,
  projectCount,
  activeSection,
  onSectionChange,
}: ProfileHeaderProps) {
  const currentUser = useAuthStore((state) => state.user);
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <section className="w-full border-b border-border bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Profile information */}
        <div className="flex items-start gap-5 sm:gap-8">
          {/* Avatar */}
          <Avatar className="h-20 w-20 shrink-0 border border-border sm:h-28 sm:w-28">
            <AvatarImage src={user.avatar} alt={user.name} />

            <AvatarFallback className="bg-muted text-xl font-semibold text-foreground sm:text-3xl">
              {user.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Name + Post count */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {user.name}
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  {user.profession || "Add your profession"}
                </p>
              </div>

              {/* Only post count */}
              <div className="shrink-0 text-center sm:min-w-20">
                <p className="text-lg leading-none font-semibold text-foreground sm:text-xl">
                  {projectCount}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">Posts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Primary navigation */}
        <nav className="mt-6 border-t border-border pt-4 sm:mt-8 sm:pt-5">
          <div className="mx-auto flex max-w-md items-center justify-center gap-10 sm:gap-24">
            {/* Posts */}
            <button
              type="button"
              aria-label="Posts"
              aria-current={activeSection === "posts" ? "page" : undefined}
              onClick={() => onSectionChange("posts")}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                activeSection === "posts"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid
                className="h-5 w-5"
                strokeWidth={activeSection === "posts" ? 2 : 1.7}
              />

              {activeSection === "posts" && (
                <span className="absolute -bottom-4.25 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-foreground sm:-bottom-5.25" />
              )}
            </button>

            {/* Bookmarked posts */}
            <button
              type="button"
              aria-label="Saved posts"
              aria-current={activeSection === "saved" ? "page" : undefined}
              onClick={() => onSectionChange("saved")}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                activeSection === "saved"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Bookmark
                className="h-5 w-5"
                strokeWidth={activeSection === "saved" ? 2 : 1.7}
              />

              {activeSection === "saved" && (
                <span className="absolute -bottom-4.25 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-foreground sm:-bottom-5.25" />
              )}
            </button>

            {/* Settings */}
            {isOwnProfile && (
              <button
                type="button"
                aria-label="Settings"
                aria-current={activeSection === "settings" ? "page" : undefined}
                onClick={() => onSectionChange("settings")}
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                  activeSection === "settings"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Settings
                  className="h-5 w-5"
                  strokeWidth={activeSection === "settings" ? 2 : 1.7}
                />
                {activeSection === "settings" && (
                  <span className="absolute -bottom-4.25 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-foreground sm:-bottom-5.25" />
                )}
              </button>
            )}
          </div>
        </nav>
      </div>
    </section>
  );
}
