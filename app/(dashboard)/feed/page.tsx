"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

import { useProjects } from "@/hooks/use-projects";
import { useDebounce } from "@/hooks/use-debounce";
import { CreateProjectBox } from "@/components/feed/create-project-box";
import { ProjectCard } from "@/components/feed/project-card";
import { FeedSkeleton } from "@/components/feed/feed-skeleton";
import { FilterBar } from "@/components/feed/filter-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchX } from "lucide-react";

function FeedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Initialize state from URL params
  const initialSearch = searchParams.get("search") || "";
  const initialStage = searchParams.get("stage") || "";

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [stage, setStage] = useState(initialStage);

  // 2. Debounce the search input so we don't spam the API
  const debouncedSearch = useDebounce(searchInput, 300);

  // 3. Fetch data using TanStack Query
  const {
    data: projects,
    isLoading,
    isError,
  } = useProjects({
    search: debouncedSearch,
    stage: stage,
  });

  // 4. Sync state back to the URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (stage) params.set("stage", stage);

    // Use replace so we don't clutter the browser history stack
    router.replace(`/feed?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, stage, router]);

  const handleStageChange = (newStage: string) => {
    setStage(newStage);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      <CreateProjectBox />

      {/* Filter Bar */}
      <FilterBar
        search={searchInput}
        stage={stage}
        onSearchChange={setSearchInput}
        onStageChange={handleStageChange}
      />

      {/* Feed Content */}
      <div className="space-y-4">
        {isLoading && (
          <>
            <FeedSkeleton />
            <FeedSkeleton />
          </>
        )}

        {isError && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
            Failed to load projects. Please try again later.
          </div>
        )}

        {!isLoading &&
          projects &&
          projects.length > 0 &&
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}

        {!isLoading && projects && projects.length === 0 && (
          <EmptyState
            icon={SearchX}
            title="No projects found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        )}
      </div>
    </div>
  );
}

export default function FeedPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6">
          <FeedSkeleton />
        </div>
      }
    >
      <FeedContent />
    </Suspense>
  );
}
