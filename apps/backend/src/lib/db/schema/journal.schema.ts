import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { InferInsertModel, InferSelectModel, relations, sql } from "drizzle-orm";
import { journalTags } from "./tags.schema";
import { user } from "./auth.schema";
import { emotions } from "./emotions.schema";

export const journals = sqliteTable(
  "journals",
  {
    id: text("id").primaryKey(),
    title: text("title"),
    content: text("content"),
    category: text("category").notNull().$type<"journal" | "dreamJournal">(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: integer("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    isDeleted: integer("is_deleted").notNull().default(0),
    isArchived: integer("is_archived").notNull().default(0),
    isStarred: integer("is_starred").notNull().default(0),
    isDraft: integer("is_draft").notNull().default(0),
  },
  (table) => [index("journal_user_id_idx").on(table.userId)]
);

export const journalsRelations = relations(journals, ({ one, many }) => ({
  user: one(user, {
    fields: [journals.userId],
    references: [user.id],
  }),
  tags: many(journalTags),
  emotions: many(emotions),
}));

export type Journal = InferSelectModel<typeof journals>;
export type InsJournal = InferInsertModel<typeof journals>;
