import { db } from "./db";
import {
  crops,
  calculations,
  type Crop,
  type Calculation,
  type InsertCalculation,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getCrops(): Promise<Crop[]>;
  getCrop(id: number): Promise<Crop | undefined>;
  getCalculations(): Promise<(Calculation & { crop: Crop })[]>;
  createCalculation(calculation: InsertCalculation): Promise<Calculation & { crop: Crop }>;
}

export class DatabaseStorage implements IStorage {
  async getCrops(): Promise<Crop[]> {
    return await db.select().from(crops);
  }

  async getCrop(id: number): Promise<Crop | undefined> {
    const [crop] = await db.select().from(crops).where(eq(crops.id, id));
    return crop;
  }

  async getCalculations(): Promise<(Calculation & { crop: Crop })[]> {
    const results = await db
      .select()
      .from(calculations)
      .innerJoin(crops, eq(calculations.cropId, crops.id))
      .orderBy(desc(calculations.createdAt));
    
    return results.map(row => ({
      ...row.calculations,
      crop: row.crops
    }));
  }

  async createCalculation(insertCalculation: InsertCalculation): Promise<Calculation & { crop: Crop }> {
    const [calc] = await db
      .insert(calculations)
      .values(insertCalculation)
      .returning();
      
    const crop = await this.getCrop(calc.cropId);
    if (!crop) {
      throw new Error("Crop not found after creating calculation");
    }
    
    return { ...calc, crop };
  }
}

export const storage = new DatabaseStorage();
