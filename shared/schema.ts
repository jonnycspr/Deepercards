import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  colorPrimary: text("color_primary").notNull(),
  colorSecondary: text("color_secondary").notNull(),
  order: integer("order").notNull().default(0),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  questions: many(questions),
}));

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  questionText: text("question_text").notNull(),
  categoryId: integer("category_id").notNull(),
  isPremium: boolean("is_premium").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const questionsRelations = relations(questions, ({ one }) => ({
  category: one(categories, {
    fields: [questions.categoryId],
    references: [categories.id],
  }),
}));

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;
