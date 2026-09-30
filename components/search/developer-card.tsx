"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { User } from "@/types/models";
import { UserPlus } from "lucide-react";
import Link from "next/link";

interface DeveloperCardProps {
  user: User;
}

export function DeveloperCard({ user }: DeveloperCardProps) {
  return (
    <Card className="flex flex-col border-border bg-card shadow-sm">
      <CardContent className="flex flex-1 flex-col items-center space-y-4 p-6 text-center">
        <Avatar className="h-20 w-20 border-2 border-border">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <Link href={`/profile/${user.id}`}>
            <h3 className="cursor-pointer text-lg font-semibold text-foreground transition-colors hover:text-primary">
              {user.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">
            {user.profession || "Developer"}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {user.techStack?.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="bg-muted text-muted-foreground"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/profile/${user.id}`} className="w-full">
          <Button variant="outline" className="w-full gap-2 border-border">
            <UserPlus className="h-4 w-4" />
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
