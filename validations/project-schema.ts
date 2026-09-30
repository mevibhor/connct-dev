import { z } from "zod";

// Step 1 Schema
export const step1Schema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Max 100 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Max 500 characters"),
});

// Step 2 Schema
export const step2Schema = z.object({
  techStack: z.string().min(1, "Please enter at least one tech stack"),
  stage: z.enum(["Idea", "MVP", "Production"], {
    required_error: "Please select a project stage",
  }),
});

// Combined type for the final API call
export type CreateProjectInput = z.infer<typeof step1Schema> &
  z.infer<typeof step2Schema>;
export type Step1Input = z.infer<typeof step1Schema>;
export type Step2Input = z.infer<typeof step2Schema>;
