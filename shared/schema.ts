import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id").notNull().references(() => users.id)
});

export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  japanese: text("japanese").notNull(),
  romaji: text("romaji").notNull(),
  spanish: text("spanish").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  userId: integer("user_id").notNull().references(() => users.id)
});

// Relaciones
export const usersRelations = relations(users, ({ many }) => ({
  categories: many(categories),
  words: many(words)
}));

export const categoriesRelations = relations(categories, ({ one }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  })
}));

export const wordsRelations = relations(words, ({ one }) => ({
  category: one(categories, {
    fields: [words.categoryId],
    references: [categories.id],
  }),
  user: one(users, {
    fields: [words.userId],
    references: [users.id],
  })
}));

// User schemas
export const insertUserSchema = createInsertSchema(users).extend({
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});

// Category schemas
export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true
});

// Word schemas
export const insertWordSchema = createInsertSchema(words).pick({
  japanese: true,
  romaji: true,
  spanish: true,
  categoryId: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertWord = z.infer<typeof insertWordSchema>;
export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Word = typeof words.$inferSelect;