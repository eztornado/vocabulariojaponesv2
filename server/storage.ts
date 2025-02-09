import { type Category, type InsertCategory, type Word, type InsertWord } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private words: Map<number, Word>;
  private categoryCurrentId: number;
  private wordCurrentId: number;

  constructor() {
    this.categories = new Map();
    this.words = new Map();
    this.categoryCurrentId = 1;
    this.wordCurrentId = 1;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category> {
    const existing = await this.getCategory(id);
    if (!existing) throw new Error("Category not found");
    
    const updated = { ...existing, ...category };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: number): Promise<void> {
    this.categories.delete(id);
    // Remove category from words
    for (const word of this.words.values()) {
      if (word.categoryId === id) {
        await this.updateWord(word.id, { categoryId: null });
      }
    }
  }

  async getWords(categoryId?: number): Promise<Word[]> {
    const words = Array.from(this.words.values());
    if (categoryId !== undefined) {
      return words.filter(word => word.categoryId === categoryId);
    }
    return words;
  }

  async getWord(id: number): Promise<Word | undefined> {
    return this.words.get(id);
  }

  async createWord(insertWord: InsertWord): Promise<Word> {
    const id = this.wordCurrentId++;
    const word: Word = { ...insertWord, id };
    this.words.set(id, word);
    return word;
  }

  async updateWord(id: number, word: Partial<InsertWord>): Promise<Word> {
    const existing = await this.getWord(id);
    if (!existing) throw new Error("Word not found");
    
    const updated = { ...existing, ...word };
    this.words.set(id, updated);
    return updated;
  }

  async deleteWord(id: number): Promise<void> {
    this.words.delete(id);
  }
}

export const storage = new MemStorage();
