"use client";

import { Suspense, useEffect, useRef, useState } from "react";

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

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const initialSearch = searchParams.get("search") || "";

  const initialStage = searchParams.get("stage") || "";

  const [searchInput, setSearchInput] = useState(initialSearch);

  const [stage, setStage] = useState(initialStage);

  const debouncedSearch = useDebounce(searchInput, 500);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProjects({
    search: debouncedSearch,
    stage,
  });

  const projects = data?.pages.flatMap((page) => page.data) || [];

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

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "200px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleStageChange = (newStage: string) => {
    setStage(newStage);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      <div className="flex h-12 items-center justify-start gap-2 border-b border-border px-4 text-base font-semibold tracking-tight md:hidden">
        <Image src="/favicon.svg" alt="CC" width={24} height={24} />

        <span>Connct Dev</span>
      </div>

      <CreateProjectBox />

      <FilterBar
        search={searchInput}
        stage={stage}
        onSearchChange={setSearchInput}
        onStageChange={handleStageChange}
      />

      <div className="space-y-4">
        {/* Initial loading */}
        {isLoading && (
          <>
            <FeedSkeleton />
            <FeedSkeleton />
          </>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
            Failed to load projects. Please try again later.
          </div>
        )}

        {/* Projects */}
        {!isLoading &&
          !isError &&
          projects.length > 0 &&
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}

        {/* Loading next batch */}
        {isFetchingNextPage && (
          <>
            <FeedSkeleton />
            <FeedSkeleton />
          </>
        )}

        {/* Empty state */}
        {!isLoading && !isError && projects.length === 0 && (
          <EmptyState
            icon={SearchX}
            title="No projects found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        )}

        {/* Infinite scroll trigger */}
        {hasNextPage && (
          <div ref={loadMoreRef} className="h-1 w-full" aria-hidden="true" />
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
