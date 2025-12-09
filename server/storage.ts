import { 
  type User, type InsertUser, 
  type Category, type InsertCategory,
  type Question, type InsertQuestion,
  users, categories, questions 
} from "@shared/schema";
import { db } from "./db";
import { eq, asc, inArray } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  updateCategoryOrder(id: number, order: number): Promise<Category | undefined>;
  
  getQuestions(categoryIds?: number[]): Promise<Question[]>;
  getQuestion(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: number, question: Partial<InsertQuestion>): Promise<Question | undefined>;
  deleteQuestion(id: number): Promise<boolean>;
  bulkCreateQuestions(questions: InsertQuestion[]): Promise<Question[]>;
  getQuestionCount(): Promise<number>;
  getQuestionCountByCategory(): Promise<{categoryId: number, count: number}[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(asc(categories.order));
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [created] = await db.insert(categories).values(category).returning();
    return created;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return updated || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return true;
  }

  async updateCategoryOrder(id: number, order: number): Promise<Category | undefined> {
    const [updated] = await db.update(categories).set({ order }).where(eq(categories.id, id)).returning();
    return updated || undefined;
  }

  async getQuestions(categoryIds?: number[]): Promise<Question[]> {
    if (categoryIds && categoryIds.length > 0) {
      return db.select().from(questions).where(inArray(questions.categoryId, categoryIds));
    }
    return db.select().from(questions);
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question || undefined;
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const [created] = await db.insert(questions).values(question).returning();
    return created;
  }

  async updateQuestion(id: number, question: Partial<InsertQuestion>): Promise<Question | undefined> {
    const [updated] = await db.update(questions).set(question).where(eq(questions.id, id)).returning();
    return updated || undefined;
  }

  async deleteQuestion(id: number): Promise<boolean> {
    await db.delete(questions).where(eq(questions.id, id));
    return true;
  }

  async bulkCreateQuestions(questionsToInsert: InsertQuestion[]): Promise<Question[]> {
    if (questionsToInsert.length === 0) return [];
    return db.insert(questions).values(questionsToInsert).returning();
  }

  async getQuestionCount(): Promise<number> {
    const result = await db.select().from(questions);
    return result.length;
  }

  async getQuestionCountByCategory(): Promise<{categoryId: number, count: number}[]> {
    const allQuestions = await db.select().from(questions);
    const countMap = new Map<number, number>();
    
    for (const q of allQuestions) {
      countMap.set(q.categoryId, (countMap.get(q.categoryId) || 0) + 1);
    }
    
    return Array.from(countMap.entries()).map(([categoryId, count]) => ({ categoryId, count }));
  }
}

export const storage = new DatabaseStorage();
