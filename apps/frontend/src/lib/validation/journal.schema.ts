import { z } from "zod";

export const createJournalSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    category: z.enum(["journal", "dreamJournal"]),
    tags: z.array(z.string()).default([]),
});

export const updateJournalSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    tags: z.array(z.string()).default([]),
});

export const journalIdSchema = z.object({
    id: z.string().uuid("Invalid journal ID"),
});

export const emotionSchema = z.object({
    id: z.string().uuid(),
    journalId: z.string().uuid(),
    emotion: z.string(),
    score: z.number(),
});

export const journalMessageSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    content: z.string(),
    category: z.enum(["journal", "dreamJournal"]),
    userId: z.string(),
    emotions: z.array(emotionSchema).optional(),
    journal_tags: z.array(z.string()).nullable().optional(),
    tags: z.array(z.string()).optional(),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
    isDeleted: z.number().optional(),
    isArchived: z.number().optional(),
    isStarred: z.number().optional(),
    isDraft: z.number().optional(),
});

export const journalResponseSchema = z.object({
    success: z.boolean(),
    status: z.number(),
    message: z.union([
        z.array(journalMessageSchema),
        journalMessageSchema
    ]),
});

export type CreateJournalInput = z.infer<typeof createJournalSchema>;
export type UpdateJournalInput = z.infer<typeof updateJournalSchema>;
export type JournalIdInput = z.infer<typeof journalIdSchema>;
export type Journal = z.infer<typeof journalMessageSchema>;
export type JournalResponse = z.infer<typeof journalResponseSchema>;
export type Emotion = z.infer<typeof emotionSchema>;

// const journalsData: {
//     id: string;
//     title: string | null;
//     content: string | null;
//     category: "journal" | "dreamJournal";
//     userId: string;
//     createdAt: number;
//     updatedAt: number;
//     isDeleted: number;
//     isArchived: number;
//     isStarred: number;
//     isDraft: number;
// }[]

export const globalSearchResponseSchema = z.object({
    id: z.string().uuid(),
    title: z.string().nullable(),
    content: z.string().nullable(),
    category: z.enum(["journal", "dreamJournal"]),
    userId: z.string(),
    createdAt: z.number(),
    updatedAt: z.number(),
    isDeleted: z.number().optional(),
    isArchived: z.number().optional(),
    isStarred: z.number().optional(),
    isDraft: z.number().optional(),
})

export type GlobalSearchResponse = z.infer<typeof globalSearchResponseSchema>;