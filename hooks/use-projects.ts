"use client";

import { useQuery } from "@tanstack/react-query";
import { Project, User } from "@/types/models";

export interface ProjectWithAuthor extends Project {
  author?: User;
}

interface ProjectsResponse {
  success: boolean;
  data: ProjectWithAuthor[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
  error?: string;
}

interface UseProjectsParams {
  search?: string;
  stage?: string;
  page?: number;
}

async function fetchProjects(
  params: UseProjectsParams,
): Promise<ProjectsResponse> {
  const queryParams = new URLSearchParams();

  if (params.search) {
    queryParams.set("search", params.search);
  }

  if (params.stage) {
    queryParams.set("stage", params.stage);
  }

  if (params.page) {
    queryParams.set("page", String(params.page));
  }

  const response = await fetch(`/api/projects?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch projects");
  }

  return result;
}

export function useProjects(params: UseProjectsParams = {}) {
  return useQuery({
    queryKey: ["projects", params.search, params.stage, params.page],
    queryFn: () => fetchProjects(params),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
