import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";

export const membersRole = ["admin", "member"] as const;

export const membersRoleEnum = pgEnum("members_role", membersRole);

export const members = pgTable("members", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  userId: text("user_id")
    .notNull().references(() => users.id, { onDelete: "cascade" }),
  role: membersRoleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const roleRequests = relations(members, ({ one }) => ({
  owner: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
}));