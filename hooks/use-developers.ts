"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { User } from "@/types/models";

interface UseDevelopersParams {
  search?: string;
  tech?: string;
}

interface DevelopersResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
    total: number;
  };
}

async function fetchDevelopers(
  params: UseDevelopersParams,
  page: number,
): Promise<DevelopersResponse> {
  const queryParams = new URLSearchParams();

  if (params.search) {
    queryParams.set("search", params.search);
  }

  if (params.tech) {
    queryParams.set("tech", params.tech);
  }

  queryParams.set("page", String(page));

  const response = await fetch(`/api/developers?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch developers");
  }

  const result = await response.json();

  return result;
}

export function useDevelopers(params: UseDevelopersParams = {}) {
  return useInfiniteQuery({
    queryKey: ["developers", params.search, params.tech],

    queryFn: ({ pageParam }) => fetchDevelopers(params, pageParam),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasMore) {
        return undefined;
      }

      return lastPage.pagination.page + 1;
    },

    staleTime: 1000 * 60 * 5,
  });
}
