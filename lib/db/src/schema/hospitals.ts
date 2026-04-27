import { pgTable, text, serial, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const hospitals = pgTable("hospitals", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  contactEmail: text("contact_email"),
  licenseNumber: text("license_number"),
  plan: text("plan").notNull().default("starter"), // starter, growth, enterprise
  paymentReference: text("payment_reference").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHospitalSchema = createInsertSchema(hospitals);
export const selectHospitalSchema = createSelectSchema(hospitals);

export type Hospital = typeof hospitals.$inferSelect;
export type NewHospital = typeof hospitals.$inferInsert;
