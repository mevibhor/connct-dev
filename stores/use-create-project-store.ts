import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CreateProjectState {
  step: 1 | 2;
  title: string;
  description: string;
  techStack: string;
  stage: "Idea" | "MVP" | "Production" | "";

  setStep: (step: 1 | 2) => void;
  updateField: (field: string, value: string) => void;
  resetForm: () => void;
}

export const useCreateProjectStore = create<CreateProjectState>()(
  persist(
    (set) => ({
      step: 1,
      title: "",
      description: "",
      techStack: "",
      stage: "",

      setStep: (step) => set({ step }),
      updateField: (field, value) =>
        set((state) => ({ ...state, [field]: value })),
      resetForm: () =>
        set({ step: 1, title: "", description: "", techStack: "", stage: "" }),
    }),
    { name: "connct-dev-create-project" },
  ),
);
