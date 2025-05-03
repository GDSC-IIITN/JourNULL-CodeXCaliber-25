import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { journals } from "./journal.schema";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const tags = sqliteTable(
  "tags",
  {
    name: text("name").primaryKey(),
  },
  (table) => [index("tags_name_idx").on(table.name)]
);

export const journalTags = sqliteTable(
  "journal_tags",
  {
    journalId: integer("journal_id")
      .notNull()
      .references(() => journals.id, { onDelete: "cascade" }),
    tagName: text("tag_name")
      .notNull()
      .references(() => tags.name, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.journalId, t.tagName] }),
  })
);

export const tagsRelations = relations(tags, ({ many }) => ({
  journals: many(journalTags),
}));

export const journalTagsRelations = relations(journalTags, ({ one }) => ({
  journal: one(journals, {
    fields: [journalTags.journalId],
    references: [journals.id],
  }),
  tag: one(tags, {
    fields: [journalTags.tagName],
    references: [tags.name],
  }),
}));

export type Tag = InferSelectModel<typeof tags>;
export type InsTag = InferInsertModel<typeof tags>;
export type JournalTag = InferSelectModel<typeof journalTags>;
export type InsJournalTag = InferInsertModel<typeof journalTags>;