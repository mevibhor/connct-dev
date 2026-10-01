"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight, ArrowLeft, PlusCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/use-auth-store";
import { useCreateProjectStore } from "@/stores/use-create-project-store";

import {
  step1Schema,
  step2Schema,
  type Step1Input,
  type Step2Input,
} from "@/validations/project-schema";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({
  isOpen,
  onClose,
}: CreateProjectModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const {
    step,
    setStep,
    updateField,
    resetForm,
    title,
    description,
    techStack,
    stage,
  } = useCreateProjectStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Step 1 now only validates Step 1 fields
  const step1Form = useForm<Step1Input>({
    resolver: zodResolver(step1Schema),
    defaultValues: { title, description },
  });

  // ✅ Step 2 now only validates Step 2 fields
  const step2Form = useForm<Step2Input>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      techStack,
      stage: stage as "Idea" | "MVP" | "Production" | undefined,
    },
  });

  // ✅ 1. Update type to Step1Input
  const onStep1Submit = (data: Step1Input) => {
    updateField("title", data.title);
    updateField("description", data.description);
    setStep(2);
  };

  // ✅ 2. Update type to Step2Input
  const onStep2Submit = async (data: Step2Input) => {
    setIsSubmitting(true);
    try {
      // ✅ 3. Combine Zustand state (Step 1) with current form data (Step 2) for the API
      const fullPayload = {
        title,
        description,
        techStack: data.techStack,
        stage: data.stage,
        authorId: user?.id,
      };

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullPayload),
      });

      const result = await response.json();

      if (result.success) {
        toast({ title: "Project posted successfully!", type: "success" });
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        if (user?.id) {
          queryClient.invalidateQueries({
            queryKey: ["profile", user.id],
          });
        }

        resetForm();
        step1Form.reset();
        step2Form.reset();
        onClose();
      } else {
        toast({ title: result.error || "Failed to post", type: "error" });
      }
    } catch (error) {
      toast({ title: `oops! ${error}`, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-border bg-card text-foreground sm:max-w-137.5">
        <DialogHeader>
          <DialogTitle>Create New Project Pitch</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Share your idea and find collaborators.
          </DialogDescription>
        </DialogHeader>

        {/* STEP 1: Details */}
        {step === 1 && (
          <form
            onSubmit={step1Form.handleSubmit(onStep1Submit)}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                placeholder="e.g., AI-Powered Task Manager"
                {...step1Form.register("title")}
                className="border-border bg-background"
              />
              {step1Form.formState.errors.title && (
                <p className="text-xs text-destructive">
                  {step1Form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What are you building and what help do you need?"
                {...step1Form.register("description")}
                className="min-h-30 border-border bg-background"
              />
              {step1Form.formState.errors.description && (
                <p className="text-xs text-destructive">
                  {step1Form.formState.errors.description.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="gap-2 bg-primary text-primary-foreground"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </form>
        )}

        {/* STEP 2: Tech & Stage */}
        {step === 2 && (
          <form
            onSubmit={step2Form.handleSubmit(onStep2Submit)}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack (comma separated)</Label>
              <Input
                id="techStack"
                placeholder="e.g., React, Node.js, PostgreSQL"
                {...step2Form.register("techStack")}
                className="border-border bg-background"
              />
              {step2Form.formState.errors.techStack && (
                <p className="text-xs text-destructive">
                  {step2Form.formState.errors.techStack.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Project Stage</Label>
              <select
                id="stage"
                {...step2Form.register("stage")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select stage...</option>
                <option value="Idea">Idea</option>
                <option value="MVP">MVP</option>
                <option value="Production">Production</option>
              </select>
              {step2Form.formState.errors.stage && (
                <p className="text-xs text-destructive">
                  {step2Form.formState.errors.stage.message}
                </p>
              )}
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="gap-2 border-border"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2 bg-primary text-primary-foreground"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="h-4 w-4" />
                )}
                {isSubmitting ? "Posting..." : "Post Project"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
