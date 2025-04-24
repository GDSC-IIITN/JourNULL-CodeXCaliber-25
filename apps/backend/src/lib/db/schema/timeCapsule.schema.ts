import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user.schema";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const timeCapsules = sqliteTable(
  "time_capsules",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    content: text("content").notNull(),
    unlockTime: integer("unlock_time", { mode: "timestamp" }).notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("time_capsule_user_id_idx").on(table.userId)]
);

export const timeCapsuleRelations = relations(timeCapsules, ({ one }) => ({
  user: one(users, {
    fields: [timeCapsules.userId],
    references: [users.id],
  }),
}));

export type TimeCapsule = InferSelectModel<typeof timeCapsules>;
export type InsTimeCapsule = InferInsertModel<typeof timeCapsules>;