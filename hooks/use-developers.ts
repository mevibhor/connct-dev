"use client";

import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/models";

interface UseDevelopersParams {
  search?: string;
  tech?: string;
}

async function fetchDevelopers(params: UseDevelopersParams): Promise<User[]> {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.set("search", params.search);
  if (params.tech) queryParams.set("tech", params.tech);

  const response = await fetch(`/api/developers?${queryParams.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch developers");
  const result = await response.json();
  return result.data;
}

export function useDevelopers(params: UseDevelopersParams = {}) {
  return useQuery({
    queryKey: ["developers", params.search, params.tech],
    queryFn: () => fetchDevelopers(params),
    staleTime: 1000 * 60 * 5,
  });
}
