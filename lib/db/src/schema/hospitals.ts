import { pgTable, text, serial, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const hospitals = pgTable("hospitals", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  licenseNumber: text("license_number"),
  plan: text("plan").notNull().default("starter"), // starter, growth, enterprise
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHospitalSchema = createInsertSchema(hospitals);
export const selectHospitalSchema = createSelectSchema(hospitals);

export type Hospital = z.infer<typeof selectHospitalSchema>;
export type NewHospital = z.infer<typeof insertHospitalSchema>;
