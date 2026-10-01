"use client";

import { Suspense, useEffect, useRef, useState } from "react";

import { useSearchParams, useRouter } from "next/navigation";

import { Search, Filter } from "lucide-react";

import { Input } from "@/components/ui/input";

import { useDevelopers } from "@/hooks/use-developers";
import { useDebounce } from "@/hooks/use-debounce";

import { DeveloperCard } from "@/components/search/developer-card";

import { FeedSkeleton } from "@/components/feed/feed-skeleton";
import { EmptyState } from "@/components/shared/empty-state";

function SearchContent() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const initialSearch = searchParams.get("search") || "";

  const initialTech = searchParams.get("tech") || "";

  const [searchInput, setSearchInput] = useState(initialSearch);

  const [techInput, setTechInput] = useState(initialTech);

  const debouncedSearch = useDebounce(searchInput, 500);

  const debouncedTech = useDebounce(techInput, 500);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDevelopers({
    search: debouncedSearch,
    tech: debouncedTech,
  });

  const developers = data?.pages.flatMap((page) => page.data) || [];

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    if (debouncedTech) {
      params.set("tech", debouncedTech);
    }

    const queryString = params.toString();

    router.replace(queryString ? `/search?${queryString}` : "/search", {
      scroll: false,
    });
  }, [debouncedSearch, debouncedTech, router]);

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

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Discover Developers
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Find collaborators by name, profession, or tech stack.
          </p>
        </div>

        {/* Search */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search by name or profession..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="h-11 border-border bg-background pl-10"
              />
            </div>

            <div className="relative w-full md:w-64">
              <Filter className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Filter by tech (e.g. React)"
                value={techInput}
                onChange={(event) => setTechInput(event.target.value)}
                className="h-11 border-border bg-background pl-10"
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="text-sm font-medium text-destructive">
              Failed to load developers.
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Please try again later.
            </p>
          </div>
        )}

        {/* Results */}
        {!isError && (
          <div className="grid grid-cols-1 gap-4">
            {/* Initial loading */}
            {isLoading &&
              [1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-40 animate-pulse rounded-xl border border-border bg-card"
                />
              ))}

            {/* Developers */}
            {!isLoading &&
              developers.length > 0 &&
              developers.map((user) => (
                <DeveloperCard key={user.id} user={user} />
              ))}

            {/* Loading next batch */}
            {isFetchingNextPage &&
              [1, 2, 3].map((item) => (
                <div
                  key={`loading-${item}`}
                  className="h-40 animate-pulse rounded-xl border border-border bg-card"
                />
              ))}

            {/* Empty state */}
            {!isLoading && developers.length === 0 && (
              <div className="col-span-full">
                <EmptyState
                  title="No developers found"
                  description="Try adjusting your search or tech filter."
                />
              </div>
            )}

            {/* Infinite scroll trigger */}
            {hasNextPage && (
              <div
                ref={loadMoreRef}
                className="h-1 w-full"
                aria-hidden="true"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <FeedSkeleton />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
