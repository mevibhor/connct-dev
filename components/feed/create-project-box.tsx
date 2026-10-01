"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CreateProjectModal } from "@/components/shared/create-project-modal";
import { useAuthStore } from "@/stores/use-auth-store";
import { SquarePen } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function CreateProjectBox() {
  const user = useAuthStore((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleCreateProject = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please login first to post!",
        type: "info",
      });
      return;
    }
    setIsModalOpen(true);
  };

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <>
      <div className="flex items-center justify-between gap-3 py-2">
        <p className="min-w-0 truncate text-sm text-muted-foreground">
          Hey {firstName}, ready to post?
        </p>

        <Button
          type="button"
          size="sm"
          onClick={handleCreateProject}
          className="shrink-0 cursor-pointer gap-1 p-4"
        >
          <SquarePen className="h-4 w-4" />
          <span>Post Project</span>
        </Button>
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
