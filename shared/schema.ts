import { pgTable, text, serial, integer, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const crops = pgTable("crops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  compostPerAcre: numeric("compost_per_acre").notNull(), // in kg
  manurePerAcre: numeric("manure_per_acre").notNull(), // in kg
  description: text("description").notNull(),
});

export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  cropId: integer("crop_id").references(() => crops.id).notNull(),
  fieldSize: numeric("field_size").notNull(), // in acres
  resultCompost: numeric("result_compost").notNull(),
  resultManure: numeric("result_manure").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCropSchema = createInsertSchema(crops).omit({ id: true });
export const insertCalculationSchema = createInsertSchema(calculations).omit({ id: true, createdAt: true, resultCompost: true, resultManure: true });

export type Crop = typeof crops.$inferSelect;
export type InsertCrop = z.infer<typeof insertCropSchema>;

export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;

export type CreateCalculationRequest = InsertCalculation;
export type CalculationResponse = Calculation & { crop: Crop };
