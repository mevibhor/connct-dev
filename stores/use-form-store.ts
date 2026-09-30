import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CollaborateFormState {
  step: 1 | 2;
  pitch: string;
  availability: "immediate" | "weekends" | "evenings" | "";
  relevantTech: string;

  setStep: (step: 1 | 2) => void;
  updateField: (field: string, value: string) => void;
  resetForm: () => void;
}

export const useCollaborateFormStore = create<CollaborateFormState>()(
  persist(
    (set) => ({
      step: 1,
      pitch: "",
      availability: "",
      relevantTech: "",

      setStep: (step) => set({ step }),

      updateField: (field, value) =>
        set((state) => ({ ...state, [field]: value })),

      resetForm: () =>
        set({
          step: 1,
          pitch: "",
          availability: "",
          relevantTech: "",
        }),
    }),
    {
      name: "connct-dev-collab-form", // Persists to localStorage
    },
  ),
);
