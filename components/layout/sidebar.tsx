"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, MessageSquare, Search, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/use-auth-store";

const comingSoonItems = [
  { label: "Notifications", icon: Bell },
  { label: "Messages", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const { toast } = useToast();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const profileHref =
    isAuthenticated && user ? `/profile/${user.id}` : "/login";

  const navItems = [
    { label: "Feed", href: "/feed", icon: Home },
    { label: "Search", href: "/search", icon: Search },
    { label: "Profile", href: profileHref, icon: User },
  ];

  const handleComingSoon = (label: string) => {
    toast({
      title: `${label} coming soon`,
      type: "info",
    });
  };

  return (
    <aside className="flex h-full flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="border-b border-border px-5 py-5">
        <Link href="/feed" className="flex items-center gap-2.5">
          <Image src="/favicon.svg" alt="Connct.dev" width={28} height={28} />

          <span className="text-lg font-semibold tracking-tight text-foreground">
            Connct Dev
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-5">
        <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Navigation
        </p>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-border bg-muted text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-md",
                    isActive
                      ? "bg-background text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* More */}
        <div className="mt-7">
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            More
          </p>

          <div className="space-y-1">
            {comingSoonItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleComingSoon(item.label)}
                  className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:bg-muted/60 hover:text-foreground"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-md">
                    <Icon className="h-4.5 w-4.5" />
                  </span>

                  <span>{item.label}</span>

                  <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    Soon
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
