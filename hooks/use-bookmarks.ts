"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/use-auth-store";
import { Project, User } from "@/types/models";

export interface BookmarkedProject extends Project {
  author?: User;
}

interface BookmarksData {
  ids: string[];
  projects: BookmarkedProject[];
}

const fetchBookmarks = async (userId: string): Promise<BookmarksData> => {
  const response = await fetch(
    `/api/bookmarks?userId=${encodeURIComponent(userId)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch bookmarks");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch bookmarks");
  }

  return result.data;
};

export function useBookmarks() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const user = useAuthStore((state) => state.user);

  const userId = user?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks", userId],
    queryFn: () => fetchBookmarks(userId as string),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const bookmarkedIds = data?.ids || [];
  const bookmarkedProjects = data?.projects || [];

  const toggleBookmarkMutation = useMutation({
    mutationFn: async (projectId: string) => {
      if (!userId) {
        throw new Error("You must be logged in");
      }

      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          projectId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update bookmark");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update bookmark");
      }

      return result.data as BookmarksData;
    },

    onMutate: async (projectId) => {
      if (!userId) {
        return;
      }

      await queryClient.cancelQueries({
        queryKey: ["bookmarks", userId],
      });

      const previousData = queryClient.getQueryData<BookmarksData>([
        "bookmarks",
        userId,
      ]);

      const previousIds = previousData?.ids || [];

      const isBookmarked = previousIds.includes(projectId);

      const updatedIds = isBookmarked
        ? previousIds.filter((id) => id !== projectId)
        : [...previousIds, projectId];

      queryClient.setQueryData<BookmarksData>(["bookmarks", userId], {
        ids: updatedIds,
        projects: previousData?.projects || [],
      });

      return {
        previousData,
      };
    },

    onError: (_error, _projectId, context) => {
      if (!userId) {
        return;
      }

      if (context?.previousData) {
        queryClient.setQueryData(["bookmarks", userId], context.previousData);
      }

      toast({
        title: "Failed to update bookmark",
        type: "error",
      });
    },

    onSuccess: (result) => {
      if (!userId) {
        return;
      }

      queryClient.setQueryData(["bookmarks", userId], result);

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },

    onSettled: () => {
      if (!userId) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["bookmarks", userId],
      });
    },
  });

  return {
    bookmarkedIds,
    bookmarkedProjects,
    toggleBookmark: toggleBookmarkMutation.mutate,
    isPending: toggleBookmarkMutation.isPending,
    isLoading,
  };
}
