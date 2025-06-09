import { z } from "zod";

export const journalAnalysisSchema = z.object({
    journal: z.string().min(1, "Journal content is required"),
});

export const journalSuggestionsSchema = z.object({
    journal: z.string().min(1, "Journal content is required"),
});

export const octacatSchema = z.object({
    context: z.string().min(1, "Context is required"),
});

export const aiResponseSchema = z.object({
    message: z.string(),
    meta: z.record(z.unknown()).optional(),
    is_error: z.boolean().optional(),
});

export type JournalAnalysisInput = z.infer<typeof journalAnalysisSchema>;
export type JournalSuggestionsInput = z.infer<typeof journalSuggestionsSchema>;
export type AIResponse = z.infer<typeof aiResponseSchema>;
export type OctacatInput = z.infer<typeof octacatSchema>;

