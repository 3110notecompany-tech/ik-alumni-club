import { pgTable, integer, pgEnum, text } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";

export const petType = ["dog", "cat"] as const;

export const petTypeEnum = pgEnum("pet_type", petType);

export const pets = pgTable("pets", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  type: petTypeEnum("type").notNull(),
  hp: integer("hp").notNull().default(50),
  ownerId: text("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const petRequests = relations(pets, ({ one }) => ({
  owner: one(users, {
    fields: [pets.ownerId],
    references: [users.id],
  }),
}));
