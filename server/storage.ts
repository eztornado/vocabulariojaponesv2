import { type Category, type InsertCategory, type Word, type InsertWord, categories, words } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;

  // Word operations
  getWords(categoryId?: number): Promise<Word[]>;
  getWord(id: number): Promise<Word | undefined>;
  createWord(word: InsertWord): Promise<Word>;
  updateWord(id: number, word: Partial<InsertWord>): Promise<Word>;
  deleteWord(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();

    if (!updatedCategory) throw new Error("Category not found");
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<void> {
    // First update words to remove the category reference
    await db
      .update(words)
      .set({ categoryId: null })
      .where(eq(words.categoryId, id));

    // Then delete the category
    await db.delete(categories).where(eq(categories.id, id));
  }

  async getWords(categoryId?: number): Promise<Word[]> {
    let query = db.select().from(words);
    if (categoryId !== undefined) {
      query = query.where(eq(words.categoryId, categoryId));
    }
    return await query;
  }

  async getWord(id: number): Promise<Word | undefined> {
    const [word] = await db.select().from(words).where(eq(words.id, id));
    return word;
  }

  async createWord(word: InsertWord): Promise<Word> {
    const [newWord] = await db.insert(words).values(word).returning();
    return newWord;
  }

  async updateWord(id: number, word: Partial<InsertWord>): Promise<Word> {
    const [updatedWord] = await db
      .update(words)
      .set(word)
      .where(eq(words.id, id))
      .returning();

    if (!updatedWord) throw new Error("Word not found");
    return updatedWord;
  }

  async deleteWord(id: number): Promise<void> {
    await db.delete(words).where(eq(words.id, id));
  }
}

export const storage = new DatabaseStorage();