import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description")
});

export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  japanese: text("japanese").notNull(),
  romaji: text("romaji").notNull(),
  spanish: text("spanish").notNull(),
  categoryId: integer("category_id").references(() => categories.id)
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true
});

export const insertWordSchema = createInsertSchema(words).pick({
  japanese: true,
  romaji: true,
  spanish: true,
  categoryId: true
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertWord = z.infer<typeof insertWordSchema>;
export type Category = typeof categories.$inferSelect;
export type Word = typeof words.$inferSelect;
