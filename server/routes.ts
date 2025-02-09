import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCategorySchema, insertWordSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Category routes
  app.get("/api/categories", async (_req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.post("/api/categories", async (req, res) => {
    const result = insertCategorySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid category data" });
    }
    const category = await storage.createCategory(result.data);
    res.status(201).json(category);
  });

  app.patch("/api/categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = insertCategorySchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid category data" });
    }
    try {
      const category = await storage.updateCategory(id, result.data);
      res.json(category);
    } catch (error) {
      res.status(404).json({ message: "Category not found" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteCategory(id);
    res.status(204).end();
  });

  // Word routes
  app.get("/api/words", async (req, res) => {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    const words = await storage.getWords(categoryId);
    res.json(words);
  });

  app.post("/api/words", async (req, res) => {
    const result = insertWordSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid word data" });
    }
    const word = await storage.createWord(result.data);
    res.status(201).json(word);
  });

  app.patch("/api/words/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = insertWordSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid word data" });
    }
    try {
      const word = await storage.updateWord(id, result.data);
      res.json(word);
    } catch (error) {
      res.status(404).json({ message: "Word not found" });
    }
  });

  app.delete("/api/words/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteWord(id);
    res.status(204).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}
