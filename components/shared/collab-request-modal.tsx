"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight, ArrowLeft, Send } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import {
  step1Schema,
  step2Schema,
  type Step1Input,
  type Step2Input,
} from "@/validations/collaborate-schema";
import { useCollaborateFormStore } from "@/stores/use-form-store";

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

export function CollaborationRequestModal({
  isOpen,
  onClose,
  projectId,
  projectName,
}: CollaborationModalProps) {
  const { toast } = useToast();
  const {
    step,
    setStep,
    updateField,
    resetForm,
    pitch,
    availability,
    relevantTech,
  } = useCollaborateFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 Form
  const step1Form = useForm<Step1Input>({
    resolver: zodResolver(step1Schema),
    defaultValues: { pitch },
  });

  // Step 2 Form
  const step2Form = useForm<Step2Input>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      availability: availability as
        undefined | "immediate" | "weekends" | "evenings",
      relevantTech,
    },
  });

  const onStep1Submit = (data: Step1Input) => {
    updateField("pitch", data.pitch);
    setStep(2);
  };

  const onStep2Submit = async (data: Step2Input) => {
    updateField("availability", data.availability);
    updateField("relevantTech", data.relevantTech);

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/collaborate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, pitch, ...data }),
      });

      const result = await response.json();

      if (result.success) {
        toast({ title: "Collaboration request sent!", type: "success" });
        resetForm(); // Clear Zustand store
        step1Form.reset();
        step2Form.reset();
        onClose();
      } else {
        toast({ title: result.error || "Failed to send", type: "error" });
      }
    } catch (error) {
      toast({ title: `oops! ${error}`, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // We don't reset the form on close, so progress is saved in Zustand!
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="border-border bg-card text-foreground sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Request to Collaborate</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Project:{" "}
            <span className="font-medium text-foreground">{projectName}</span>
          </DialogDescription>
        </DialogHeader>

        {/* STEP 1: The Pitch */}
        {step === 1 && (
          <form
            onSubmit={step1Form.handleSubmit(onStep1Submit)}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <Label htmlFor="pitch">Your Pitch</Label>
              <Textarea
                id="pitch"
                placeholder="Tell the developer why you want to collaborate and what you bring to the table..."
                {...step1Form.register("pitch")}
                className="min-h-37.5 border-border bg-background"
              />
              {step1Form.formState.errors.pitch && (
                <p className="text-xs text-destructive">
                  {step1Form.formState.errors.pitch.message}
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

        {/* STEP 2: Availability & Tech */}
        {step === 2 && (
          <form
            onSubmit={step2Form.handleSubmit(onStep2Submit)}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <select
                id="availability"
                {...step2Form.register("availability")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select availability...</option>
                <option value="immediate">Immediate</option>
                <option value="weekends">Weekends Only</option>
                <option value="evenings">Evenings Only</option>
              </select>
              {step2Form.formState.errors.availability && (
                <p className="text-xs text-destructive">
                  {step2Form.formState.errors.availability.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="relevantTech">Relevant Tech Stack</Label>
              <Input
                id="relevantTech"
                placeholder="e.g., React, Tailwind, Node.js"
                {...step2Form.register("relevantTech")}
                className="border-border bg-background"
              />
              {step2Form.formState.errors.relevantTech && (
                <p className="text-xs text-destructive">
                  {step2Form.formState.errors.relevantTech.message}
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
                  <Send className="h-4 w-4" />
                )}
                {isSubmitting ? "Sending..." : "Send Request"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
