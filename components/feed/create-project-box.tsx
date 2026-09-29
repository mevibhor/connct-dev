"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/stores/use-auth-store";
import { ImagePlus } from "lucide-react";

export function CreateProjectBox() {
  const user = useAuthStore((state) => state.user);

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-primary/10 font-medium text-primary">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <Button
            variant="outline"
            className="h-10 flex-1 justify-start bg-background text-left text-muted-foreground hover:bg-muted"
          >
            Share a project or request collaborators...
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <ImagePlus className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
