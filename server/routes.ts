import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { crops } from "@shared/schema";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existingCrops = await storage.getCrops();
  if (existingCrops.length === 0) {
    console.log("Seeding initial crops...");
    await db.insert(crops).values([
      { name: "Wheat", compostPerAcre: "4000", manurePerAcre: "2000", description: "Standard requirements for wheat." },
      { name: "Corn (Maize)", compostPerAcre: "5000", manurePerAcre: "2500", description: "Heavy feeder, requires more nutrients." },
      { name: "Rice", compostPerAcre: "4500", manurePerAcre: "2200", description: "Requires steady nutrient release." },
      { name: "Tomatoes", compostPerAcre: "6000", manurePerAcre: "3000", description: "High demand for potassium and phosphorus." },
      { name: "Potatoes", compostPerAcre: "5500", manurePerAcre: "2800", description: "Root crop requiring well-rotted organic matter." },
    ]);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed the database
  await seedDatabase().catch(console.error);

  
  app.get(api.crops.list.path, async (req, res) => {
    try {
      const allCrops = await storage.getCrops();
      res.json(allCrops);
    } catch (err) {
      console.error("Failed to get crops:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.calculations.list.path, async (req, res) => {
    try {
      const history = await storage.getCalculations();
      res.json(history);
    } catch (err) {
      console.error("Failed to get calculations:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.calculations.create.path, async (req, res) => {
    try {
      const input = api.calculations.create.input.parse(req.body);
      
      const crop = await storage.getCrop(input.cropId);
      if (!crop) {
        return res.status(400).json({
          message: "Selected crop does not exist",
          field: "cropId"
        });
      }

      // Calculate organic fertilizer recommendations
      // Logic: base rate per acre * field size
      const fieldSizeNum = Number(input.fieldSize);
      const resultCompost = (Number(crop.compostPerAcre) * fieldSizeNum).toString();
      const resultManure = (Number(crop.manurePerAcre) * fieldSizeNum).toString();

      const newCalc = await storage.createCalculation({
        cropId: input.cropId,
        fieldSize: input.fieldSize.toString(),
        resultCompost,
        resultManure
      });
      
      res.status(201).json(newCalc);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Failed to create calculation:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
