import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { user } from "./auth.schema";


export const guilts = sqliteTable(
  "guilts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    content: text("content").notNull(),
    dumpTime: integer("dump_time", { mode: "timestamp" })
      .notNull()
      .defaultNow(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("guilt_user_id_idx").on(table.userId)]
);

export const guiltsRelations = relations(guilts, ({ one }) => ({
  user: one(user, {
    fields: [guilts.userId],
    references: [user.id],
  }),
}));

export type Guilt = InferSelectModel<typeof guilts>;
export type InsGuilts = InferInsertModel<typeof guilts>;
