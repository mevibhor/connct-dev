"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

import { useDevelopers } from "@/hooks/use-developers";
import { useDebounce } from "@/hooks/use-debounce";
import { DeveloperCard } from "@/components/search/developer-card";
import { FeedSkeleton } from "@/components/feed/feed-skeleton"; // Reusing feed skeleton for simplicity
import { EmptyState } from "@/components/shared/empty-state";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSearch = searchParams.get("search") || "";
  const initialTech = searchParams.get("tech") || "";

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [techInput, setTechInput] = useState(initialTech);

  const debouncedSearch = useDebounce(searchInput, 300);
  const debouncedTech = useDebounce(techInput, 300);

  const { data: developers, isLoading } = useDevelopers({
    search: debouncedSearch,
    tech: debouncedTech,
  });

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (debouncedTech) params.set("tech", debouncedTech);
    router.replace(`/search?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, debouncedTech, router]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Discover Developers
        </h1>
        <p className="text-muted-foreground">
          Find collaborators by name, profession, or tech stack.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or profession..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-11 border-border bg-card pl-10"
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by tech (e.g. React)"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            className="h-11 border-border bg-card pl-10"
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && (
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-62.5 animate-pulse rounded-xl border border-border bg-card"
              />
            ))}
          </>
        )}

        {!isLoading &&
          developers &&
          developers.length > 0 &&
          developers.map((user) => <DeveloperCard key={user.id} user={user} />)}

        {!isLoading && developers && developers.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              title="No developers found"
              description="Try adjusting your search or tech filter."
            />
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
        <div className="p-6">
          <FeedSkeleton />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
