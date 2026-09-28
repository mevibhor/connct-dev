"use client";

import { toast as baseToastManager } from "@/components/ui/toast";

export type ToastProps = {
  title?: string;
  description?: string;
  type?: "success" | "info" | "warning" | "error" | "loading";
};

function toast({ title, type }: ToastProps) {
  // Base UI uses the .add() method to trigger a toast
  baseToastManager.add({
    title,
    type,
  });
}

function useToast() {
  return { toast };
}

export { useToast, toast };
