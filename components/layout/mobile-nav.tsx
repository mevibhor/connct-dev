"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, User, Bell, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/use-auth-store";
import { cn } from "@/lib/utils";

const mainNav = [
  { label: "Feed", href: "/feed", icon: Home },
  { label: "Search", href: "/search", icon: Search },
];

const comingSoonNav = [
  { label: "Notifications", icon: Bell },
  { label: "Messages", icon: MessageSquare },
];

export function MobileNav() {
  const pathname = usePathname();
  const { toast } = useToast();

  // ✅ Dynamically get the current user's ID for the profile link
  const currentUser = useAuthStore((state) => state.user);
  const profileHref = currentUser ? `/profile/${currentUser.id}` : "/profile/1";

  const handleComingSoon = (label: string) => {
    toast({ title: `${label} coming soon`, type: "info" });
  };

  return (
    <nav className="flex h-16 items-center justify-around border-t border-border bg-background/80 px-2 pb-2 backdrop-blur-md">
      {/* Main Navigation Links */}
      {mainNav.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center rounded-lg p-2 transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className={cn("h-6 w-6", isActive && "fill-current/10")} />
          </Link>
        );
      })}

      {/* Profile Link (Dynamic) */}
      <Link
        href={profileHref}
        className={cn(
          "flex flex-col items-center justify-center rounded-lg p-2 transition-colors",
          pathname.startsWith("/profile")
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <User
          className={cn(
            "h-6 w-6",
            pathname.startsWith("/profile") && "fill-current/10",
          )}
        />
      </Link>

      {/* Coming Soon Buttons */}
      {comingSoonNav.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onClick={() => handleComingSoon(item.label)}
            className="flex flex-col items-center justify-center p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon className="h-6 w-6" />
          </button>
        );
      })}
    </nav>
  );
}
