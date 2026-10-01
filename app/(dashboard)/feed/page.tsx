"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { useProjects } from "@/hooks/use-projects";
import { useDebounce } from "@/hooks/use-debounce";
import { CreateProjectBox } from "@/components/feed/create-project-box";
import { ProjectCard } from "@/components/feed/project-card";
import { FeedSkeleton } from "@/components/feed/feed-skeleton";
import { FilterBar } from "@/components/feed/filter-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchX } from "lucide-react";
import Image from "next/image";

function FeedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSearch = searchParams.get("search") || "";
  const initialStage = searchParams.get("stage") || "";

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [stage, setStage] = useState(initialStage);

  const debouncedSearch = useDebounce(searchInput, 500);

  const { data, isLoading, isError } = useProjects({
    search: debouncedSearch,
    stage,
  });

  const projects = data?.data || [];

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    if (stage) {
      params.set("stage", stage);
    }

    const queryString = params.toString();

    router.replace(queryString ? `/feed?${queryString}` : "/feed", {
      scroll: false,
    });
  }, [debouncedSearch, stage, router]);

  const handleStageChange = (newStage: string) => {
    setStage(newStage);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      <div className="flex h-12 items-center justify-start gap-2 border-b border-border px-4 text-base font-semibold tracking-tight md:hidden">
        <Image src="/favicon.svg" alt="CC" width={24} height={24} />
        <span> Connct Dev</span>
      </div>
      <CreateProjectBox />

      <FilterBar
        search={searchInput}
        stage={stage}
        onSearchChange={setSearchInput}
        onStageChange={handleStageChange}
      />

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
          !isError &&
          projects.length > 0 &&
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}

        {!isLoading && !isError && projects.length === 0 && (
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
