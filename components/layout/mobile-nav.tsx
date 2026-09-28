"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, User, Bell, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { href: "/feed", icon: Home },
  { href: "/search", icon: Search },
  { href: "/profile/1", icon: User },
];

const comingSoonIcons = [
  { label: "Notifications", icon: Bell },
  { label: "Messages", icon: MessageSquare },
];

export function MobileNav() {
  const pathname = usePathname();
  const { toast } = useToast();

  const handleComingSoon = () => {
    toast({
      title: "Feature coming soon",
      type: "info",
    });
  };

  return (
    <div className="flex h-16 items-center justify-around p-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center rounded-lg p-2 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="h-6 w-6" />
          </Link>
        );
      })}

      {comingSoonIcons.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onClick={() => handleComingSoon()}
            className="flex flex-col items-center justify-center p-2 text-muted-foreground"
          >
            <Icon className="h-6 w-6" />
          </button>
        );
      })}
    </div>
  );
}
