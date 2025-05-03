import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { user } from "./auth-schema";

export const timeCapsules = sqliteTable(
  "time_capsules",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    content: text("content").notNull(),
    unlockTime: integer("unlock_time", { mode: "timestamp" }).notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("time_capsule_user_id_idx").on(table.userId)]
);

export const timeCapsuleRelations = relations(timeCapsules, ({ one }) => ({
  user: one(user, {
    fields: [timeCapsules.userId],
    references: [user.id],
  }),
}));

export type TimeCapsule = InferSelectModel<typeof timeCapsules>;
export type InsTimeCapsule = InferInsertModel<typeof timeCapsules>;