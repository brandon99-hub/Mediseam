import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { hospitals } from "./hospitals";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  hospitalId: uuid("hospital_id").references(() => hospitals.id),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // Hashed
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  department: text("department").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
