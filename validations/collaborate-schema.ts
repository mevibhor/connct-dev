import { z } from "zod";

// Step 1: The Pitch
export const step1Schema = z.object({
  pitch: z
    .string()
    .min(20, "Pitch must be at least 20 characters")
    .max(500, "Max 500 characters"),
});

// Step 2: Availability & Tech
export const step2Schema = z.object({
  availability: z.enum(["immediate", "weekends", "evenings"], {
    required_error: "Please select your availability",
  }),
  relevantTech: z.string().min(1, "Please list at least one relevant tech"),
});

export type Step1Input = z.infer<typeof step1Schema>;
export type Step2Input = z.infer<typeof step2Schema>;
