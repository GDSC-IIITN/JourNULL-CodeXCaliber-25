import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user.schema";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { journalTags } from "./tags.schema";

export const journals = sqliteTable(
  "journals",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title"),
    content: text("content"),
    category: text("category").notNull().$type<"journal" | "dreamJournal">(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("journal_user_id_idx").on(table.userId)]
);

export const journalsRelations = relations(journals, ({ one, many }) => ({
  user: one(users, {
    fields: [journals.userId],
    references: [users.id],
  }),
  tags: many(journalTags),
}));

export type Journal = InferSelectModel<typeof journals>;
export type InsJournal = InferInsertModel<typeof journals>;
