"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  search: string;
  stage: string;
  onSearchChange: (value: string) => void;
  onStageChange: (value: string) => void;
}

const stages = ["Idea", "MVP", "Production"];

export function FilterBar({
  search,
  stage,
  onSearchChange,
  onStageChange,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects, tech stacks, or keywords..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 border-border bg-card pl-10 focus-visible:ring-ring"
        />
      </div>

      {/* Stage Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant="outline"
          className={cn(
            "cursor-pointer px-3 py-1 transition-colors",
            !stage
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:bg-muted",
          )}
          onClick={() => onStageChange("")}
        >
          All Stages
        </Badge>
        {stages.map((s) => (
          <Badge
            key={s}
            variant="outline"
            className={cn(
              "cursor-pointer px-3 py-1 transition-colors",
              stage === s
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-muted",
            )}
            onClick={() => onStageChange(s)}
          >
            {s}
          </Badge>
        ))}
      </div>
    </div>
  );
}
