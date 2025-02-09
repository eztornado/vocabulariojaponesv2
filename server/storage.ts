import { type Category, type InsertCategory, type Word, type InsertWord, type User, type InsertUser, categories, words, users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category operations
  getCategories(userId: number): Promise<Category[]>;
  getCategory(id: number, userId: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory & { userId: number }): Promise<Category>;
  updateCategory(id: number, userId: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number, userId: number): Promise<void>;

  // Word operations
  getWords(userId: number, categoryId?: number): Promise<Word[]>;
  getWord(id: number, userId: number): Promise<Word | undefined>;
  createWord(word: InsertWord & { userId: number }): Promise<Word>;
  updateWord(id: number, userId: number, word: Partial<InsertWord>): Promise<Word>;
  deleteWord(id: number, userId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Category operations
  async getCategories(userId: number): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.userId, userId));
  }

  async getCategory(id: number, userId: number): Promise<Category | undefined> {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .where(eq(categories.userId, userId));
    return category;
  }

  async createCategory(category: InsertCategory & { userId: number }): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: number, userId: number, category: Partial<InsertCategory>): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .where(eq(categories.userId, userId))
      .returning();

    if (!updatedCategory) throw new Error("Category not found");
    return updatedCategory;
  }

  async deleteCategory(id: number, userId: number): Promise<void> {
    // First update words to remove the category reference
    await db
      .update(words)
      .set({ categoryId: null })
      .where(eq(words.categoryId, id))
      .where(eq(words.userId, userId));

    // Then delete the category
    await db
      .delete(categories)
      .where(eq(categories.id, id))
      .where(eq(categories.userId, userId));
  }

  // Word operations
  async getWords(userId: number, categoryId?: number): Promise<Word[]> {
    let query = db.select().from(words).where(eq(words.userId, userId));
    if (categoryId !== undefined) {
      query = query.where(eq(words.categoryId, categoryId));
    }
    return await query;
  }

  async getWord(id: number, userId: number): Promise<Word | undefined> {
    const [word] = await db
      .select()
      .from(words)
      .where(eq(words.id, id))
      .where(eq(words.userId, userId));
    return word;
  }

  async createWord(word: InsertWord & { userId: number }): Promise<Word> {
    const [newWord] = await db.insert(words).values(word).returning();
    return newWord;
  }

  async updateWord(id: number, userId: number, word: Partial<InsertWord>): Promise<Word> {
    const [updatedWord] = await db
      .update(words)
      .set(word)
      .where(eq(words.id, id))
      .where(eq(words.userId, userId))
      .returning();

    if (!updatedWord) throw new Error("Word not found");
    return updatedWord;
  }

  async deleteWord(id: number, userId: number): Promise<void> {
    await db
      .delete(words)
      .where(eq(words.id, id))
      .where(eq(words.userId, userId));
  }
}

export const storage = new DatabaseStorage();