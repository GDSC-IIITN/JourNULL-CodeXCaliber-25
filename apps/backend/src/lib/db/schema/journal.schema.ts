import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { journalTags } from "./tags.schema";
import { user } from "./auth.schema";

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
  },
  (table) => [index("journal_user_id_idx").on(table.userId)]
);

export const journalsRelations = relations(journals, ({ one, many }) => ({
  user: one(user, {
    fields: [journals.userId],
    references: [user.id],
  }),
  tags: many(journalTags),
}));

export type Journal = InferSelectModel<typeof journals>;
export type InsJournal = InferInsertModel<typeof journals>;
