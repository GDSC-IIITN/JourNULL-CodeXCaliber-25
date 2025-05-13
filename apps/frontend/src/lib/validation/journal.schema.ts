import { z } from "zod";

export const createJournalSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    category: z.enum(["journal", "dreamJournal"]),
});

export const updateJournalSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
});

export const journalIdSchema = z.object({
    id: z.string().uuid("Invalid journal ID"),
});

export const journalSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    content: z.string(),
    category: z.enum(["journal", "dreamJournal"]),
    userId: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const journalResponseSchema = z.object({
    message: z.array(journalSchema),
    meta: z.record(z.unknown()).optional(),
    is_error: z.boolean().optional(),
});

export type CreateJournalInput = z.infer<typeof createJournalSchema>;
export type UpdateJournalInput = z.infer<typeof updateJournalSchema>;
export type JournalIdInput = z.infer<typeof journalIdSchema>;
export type Journal = z.infer<typeof journalSchema>;
export type JournalResponse = z.infer<typeof journalResponseSchema>; 