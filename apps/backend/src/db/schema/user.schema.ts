import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { journals } from "./journal.schema";
import { guilts } from "./guilt.schema";
import { timeCapsules } from "./timeCapsule.schema";

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull().unique(),
    username: text("username").notNull().unique(),
    profilePhoto: text("profile_photo"),
    password: text("password").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
  },
  (table) => [
    index("user_email_idx").on(table.email),
    index("user_username_idx").on(table.username),
  ]
);

export const usersRelations = relations(users, ({ many }) => ({
  journals: many(journals),
  guilts: many(guilts),
  timeCapsules: many(timeCapsules),
}));

export type User = InferSelectModel<typeof users>;
export type InsUser = InferInsertModel<typeof users>;
