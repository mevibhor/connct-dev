"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// 1. Fetch initial bookmarks
const fetchBookmarks = async (): Promise<string[]> => {
  const response = await fetch("/api/bookmarks");
  if (!response.ok) throw new Error("Failed to fetch bookmarks");
  const result = await response.json();
  return result.data;
};

export function useBookmarks() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query to get the list of bookmarked IDs
  const { data: bookmarkedIds = [] } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarks,
    staleTime: 1000 * 60 * 5,
  });

  // Mutation to toggle a bookmark
  const toggleBookmarkMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      if (!response.ok) throw new Error("Failed to toggle bookmark");
      const result = await response.json();
      return result.data; // Returns the new array of IDs
    },

    //  OPTIMISTIC UPDATE: Runs before the API call finishes
    onMutate: async (projectId) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });

      // Snapshot the previous value
      const previousBookmarks =
        queryClient.getQueryData<string[]>(["bookmarks"]) || [];

      // Optimistically update the cache
      const isBookmarked = previousBookmarks.includes(projectId);
      const newBookmarks = isBookmarked
        ? previousBookmarks.filter((id) => id !== projectId)
        : [...previousBookmarks, projectId];

      queryClient.setQueryData(["bookmarks"], newBookmarks);

      // Return context with the snapshotted value
      return { previousBookmarks };
    },

    //  ROLLBACK: If the API fails, revert to the snapshot
    onError: (err, projectId, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(["bookmarks"], context.previousBookmarks);
      }
      toast({
        title: "Failed to update bookmark",
        type: "error",
      });
    },

    // ✅ REFETCH: Always refetch after error or success to ensure sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  return {
    bookmarkedIds,
    toggleBookmark: toggleBookmarkMutation.mutate,
    isPending: toggleBookmarkMutation.isPending,
  };
}
