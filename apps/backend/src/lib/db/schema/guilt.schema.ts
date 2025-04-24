import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { users } from "./user.schema";

export const guilts = sqliteTable(
  "guilts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    content: text("content").notNull(),
    dumpTime: integer("dump_time", { mode: "timestamp" })
      .notNull()
      .defaultNow(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("guilt_user_id_idx").on(table.userId)]
);

export const guiltsRelations = relations(guilts, ({ one }) => ({
  user: one(users, {
    fields: [guilts.userId],
    references: [users.id],
  }),
}));

export type Guilt = InferSelectModel<typeof guilts>;
export type InsGuilts = InferInsertModel<typeof guilts>;
