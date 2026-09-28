"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, User, Bell, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast"; // Shadcn toast hook
import Image from "next/image";

const navItems = [
  { label: "Feed", href: "/feed", icon: Home },
  { label: "Search", href: "/search", icon: Search },
  { label: "Profile", href: "/profile/1", icon: User }, // Mock ID for now
];

const comingSoonItems = [
  { label: "Notifications", icon: Bell },
  { label: "Messages", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const { toast } = useToast();

  const handleComingSoon = () => {
    toast({
      title: "Feature coming soon",
      type: "info",
    });
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-4">
      {/* Logo Area */}
      <div className="flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          <Image src="" alt="C" />
        </div>
        <span className="text-xl font-bold text-foreground">Connct Dev</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                isActive ? "bg-muted text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}

        {/* "Coming Soon" Items */}
        {comingSoonItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => handleComingSoon()}
              className="flex w-full items-center gap-4 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
