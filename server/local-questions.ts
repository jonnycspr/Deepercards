// Local test questions - not committed to git
// These are for local development and testing only

import { questions } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export const localTestQuestions = [
  // One question per category (9 categories total)
  { categoryId: 1, questionText: "What values are most important to you in a partner?", isPremium: false },
  { categoryId: 2, questionText: "How did your family celebrate holidays when you were growing up?", isPremium: false },
  { categoryId: 3, questionText: "What makes you laugh the most?", isPremium: false },
  { categoryId: 4, questionText: "How do you prefer to communicate when something is bothering you?", isPremium: false },
  { categoryId: 5, questionText: "What are your thoughts on budgeting and financial planning?", isPremium: false },
  { categoryId: 6, questionText: "How does your faith influence your daily decisions?", isPremium: false },
  { categoryId: 7, questionText: "What does physical intimacy mean to you in a relationship?", isPremium: false },
  { categoryId: 8, questionText: "Where do you see us in five years?", isPremium: false },
  { categoryId: 9, questionText: "What's a topic you've always wanted to discuss but haven't yet?", isPremium: false },
];

export async function seedLocalQuestions() {
  try {
    console.log("Seeding local test questions...");
    
    // Check if any of these questions already exist (by text) to avoid duplicates
    const existingQuestions = await db.select().from(questions);
    const existingTexts = new Set(existingQuestions.map(q => q.questionText));
    
    const questionsToInsert = localTestQuestions.filter(
      q => !existingTexts.has(q.questionText)
    );
    
    if (questionsToInsert.length === 0) {
      console.log("All local test questions already exist, skipping...");
      return;
    }
    
    await db.insert(questions).values(questionsToInsert);
    console.log(`Successfully added ${questionsToInsert.length} local test questions!`);
  } catch (error) {
    console.error("Error seeding local questions:", error);
    throw error;
  }
}

