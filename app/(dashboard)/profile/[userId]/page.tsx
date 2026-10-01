"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { ArrowLeft, UserRoundX } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Project, User } from "@/types/models";

import { useBookmarks } from "@/hooks/use-bookmarks";

import {
  ProfileHeader,
  type ProfileSection,
} from "@/components/profile/profile-header";

import { ProfileTabs } from "@/components/profile/profile-tabs";
import { FeedSkeleton } from "@/components/feed/feed-skeleton";

interface ProfileResponse {
  user: User;
  projects: Project[];
}

async function fetchProfile(userId: string): Promise<ProfileResponse> {
  const response = await fetch(`/api/profile/${userId}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch profile");
  }

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch profile");
  }

  return result.data;
}

function ProfileNotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <UserRoundX className="h-8 w-8 text-muted-foreground" />
        </div>

        <h1 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
          Profile not found
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          We couldn&apos;t find a developer with this profile. The account may
          have been removed or the profile link may be incorrect.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>

          <Button onClick={() => router.push("/search")}>
            Discover developers
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProfileError() {
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <UserRoundX className="h-8 w-8 text-destructive" />
        </div>

        <h1 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          We couldn&apos;t load this profile right now. Please try again or
          return to the developer search.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>

          <Button onClick={() => router.push("/search")}>
            Discover developers
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const params = useParams();

  const userId = params.userId as string;

  const [activeSection, setActiveSection] = useState<ProfileSection>("posts");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId),
    enabled: !!userId,
    retry: 1,
  });

  const { bookmarkedProjects } = useBookmarks();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-40 w-full animate-pulse rounded-xl bg-muted" />

        <FeedSkeleton />
      </div>
    );
  }

  if (isError) {
    const isNotFound =
      error instanceof Error && error.message === "User not found";

    if (isNotFound) {
      return <ProfileNotFound />;
    }

    return <ProfileError />;
  }

  if (!data) {
    return <ProfileError />;
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <ProfileHeader
        user={data.user}
        projectCount={data.projects.length}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <ProfileTabs
        user={data.user}
        projects={data.projects}
        bookmarkedProjects={bookmarkedProjects}
        activeSection={activeSection}
      />
    </div>
  );
}
