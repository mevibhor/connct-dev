"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    icon: Monitor,
  },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-3">
        <div className="h-5 w-16 animate-pulse rounded bg-muted" />

        <div className="grid grid-cols-3 gap-2 sm:max-w-md">
          {themes.map((item) => (
            <div
              key={item.value}
              className="h-16 animate-pulse rounded-lg border border-border bg-muted/50"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium text-foreground">Theme</h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Choose how the application should appear.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:max-w-md">
        {themes.map((item) => {
          const Icon = item.icon;
          const isActive = theme === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setTheme(item.value)}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-lg border px-3 py-2 transition-colors",
                isActive
                  ? "border-foreground bg-muted text-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.8} />

              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
