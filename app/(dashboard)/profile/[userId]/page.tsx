"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Project, User } from "@/types/models";
import { mockProjects } from "@/lib/mock-data"; // ✅ Import global mock data to filter
import { useBookmarks } from "@/hooks/use-bookmarks"; // ✅ Import the bookmark hook
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

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  const result = await response.json();

  return result.data;
}

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  /*
   * This is the SINGLE source of truth for:
   * posts, saved posts, settings
   */
  const [activeSection, setActiveSection] = useState<ProfileSection>("posts");

  // 1. Fetch Profile Data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId),
    enabled: !!userId,
  });

  // 2. Fetch Bookmarks (Client-side state)
  const { bookmarkedIds } = useBookmarks();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-40 w-full animate-pulse rounded-xl bg-muted" />
        <FeedSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-75 items-center justify-center p-8 text-destructive">
        Failed to load profile.
      </div>
    );
  }

  // 3. Filter the global mock projects to find the ones the user bookmarked
  const bookmarkedProjects = mockProjects.filter((p) =>
    bookmarkedIds.includes(p.id),
  );

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
        bookmarkedProjects={bookmarkedProjects} // ✅ Pass the real filtered data here
        activeSection={activeSection}
      />
    </div>
  );
}
