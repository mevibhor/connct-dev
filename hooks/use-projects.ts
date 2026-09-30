"use client";

import { useQuery } from "@tanstack/react-query";
import { Project } from "@/types/models";

interface UseProjectsParams {
  search?: string;
  stage?: string;
}

async function fetchProjects(params: UseProjectsParams): Promise<Project[]> {
  // Build the query string dynamically
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.set("search", params.search);
  if (params.stage) queryParams.set("stage", params.stage);

  const response = await fetch(`/api/projects?${queryParams.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("Failed to fetch projects");
  const result = await response.json();
  return result.data;
}

export function useProjects(params: UseProjectsParams = {}) {
  return useQuery({
    // The queryKey now includes the params.
    // TanStack Query will automatically refetch when these change!
    queryKey: ["projects", params.search, params.stage],
    queryFn: () => fetchProjects(params),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
