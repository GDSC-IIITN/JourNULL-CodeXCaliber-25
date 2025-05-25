import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { journals } from "./journal.schema";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";


export const emotions = sqliteTable("emotions", {
    id: text("id").primaryKey(),
    journalId: text("journal_id")
        .notNull()
        .references(() => journals.id, { onDelete: "cascade" }),
    emotion: text("emotion").notNull().$type<"happy" | "sad" | "angry" | "fearful" | "disgusted" | "surprised" | "content" | "anxious" | "depressed" | "exhausted" | "stressed" | "other">(),
    score: integer("score").notNull(),
});

export const emotionsRelations = relations(emotions, ({ one }) => ({
    journal: one(journals, {
        fields: [emotions.journalId],
        references: [journals.id],
    }),
}));

export type Emotion = InferSelectModel<typeof emotions>;
export type InsEmotion = InferInsertModel<typeof emotions>;