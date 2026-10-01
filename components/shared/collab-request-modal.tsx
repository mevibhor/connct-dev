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
import { useAuthStore } from "@/stores/use-auth-store";

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

  const user = useAuthStore((state) => state.user);

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

  const step1Form = useForm<Step1Input>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      pitch,
    },
  });

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
    if (!user?.id) {
      toast({
        title: "Please login to inquire",
        type: "error",
      });

      return;
    }

    updateField("availability", data.availability);

    updateField("relevantTech", data.relevantTech);

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/collaborate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          projectId,
          pitch,
          availability: data.availability,
          relevantTech: data.relevantTech,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to send collaboration request");
      }

      toast({
        title: "Collaboration request sent!",
        type: "success",
      });

      resetForm();

      step1Form.reset();
      step2Form.reset();

      onClose();
    } catch (error) {
      toast({
        title:
          error instanceof Error
            ? error.message
            : "Failed to send collaboration request",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="border-border bg-card text-foreground sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Inquire about {projectName}</DialogTitle>

          <DialogDescription>
            Tell the project owner how you can contribute.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <form
            onSubmit={step1Form.handleSubmit(onStep1Submit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="pitch">Your pitch</Label>

              <Textarea
                id="pitch"
                placeholder="Tell the owner why you would be a good fit..."
                {...step1Form.register("pitch")}
              />

              {step1Form.formState.errors.pitch && (
                <p className="text-sm text-destructive">
                  {step1Form.formState.errors.pitch.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="submit" className="gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={step2Form.handleSubmit(onStep2Submit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>

              <select
                id="availability"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...step2Form.register("availability")}
              >
                <option value="">Select availability</option>

                <option value="immediate">Immediate</option>

                <option value="weekends">Weekends</option>

                <option value="evenings">Evenings</option>
              </select>

              {step2Form.formState.errors.availability && (
                <p className="text-sm text-destructive">
                  {step2Form.formState.errors.availability.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="relevantTech">Relevant skills / tech</Label>

              <Input
                id="relevantTech"
                placeholder="React, TypeScript, UI/UX..."
                {...step2Form.register("relevantTech")}
              />

              {step2Form.formState.errors.relevantTech && (
                <p className="text-sm text-destructive">
                  {step2Form.formState.errors.relevantTech.message}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Inquiry
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
