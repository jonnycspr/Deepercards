import { db } from "./db";
import { categories, questions, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const defaultCategories = [
  { name: "Character and Personality", icon: "person", colorPrimary: "#ff4d4f", colorSecondary: "#ffcccc", order: 1, fillType: "solid", textColor: "#bf0000", borderColor: "#FFFFFF", borderWidth: 8 },
  { name: "Origin and Family", icon: "home", colorPrimary: "#ff8500", colorSecondary: "#ffe0b3", order: 2, fillType: "solid", textColor: "#d54900", borderColor: "#FFFFFF", borderWidth: 8 },
  { name: "Humor and Joy", icon: "smile", colorPrimary: "#ffdc54", colorSecondary: "#fff4c2", order: 3, fillType: "solid", textColor: "#cda505", borderColor: "#FFFFFF", borderWidth: 8 },
  { name: "Relationship and Communication", icon: "chat", colorPrimary: "#008475", colorSecondary: "#b3e0db", order: 4, fillType: "solid", textColor: "#43f2da", borderColor: "#FFFFFF", borderWidth: 8 },
  { name: "Finances", icon: "wallet", colorPrimary: "#00c9b5", colorSecondary: "#b3f0e9", order: 5, fillType: "solid", textColor: "#195b5d", borderColor: "#FFFFFF", borderWidth: 8 },
  { name: "Faith", icon: "heart", colorPrimary: "#9ed1d6", colorSecondary: "#d9eff1", order: 6, fillType: "solid", textColor: "#4b8085", borderColor: "#FFFFFF", borderWidth: 8 },
  { name: "Sexuality", icon: "heart", colorPrimary: "#8253ee", colorSecondary: "#d9ccf9", order: 7, fillType: "solid", textColor: "#c6a8ff", borderColor: "#FFFFFF", borderWidth: 8 },
  { name: "Future and Marriage", icon: "ring", colorPrimary: "#455fed", colorSecondary: "#c9d4f9", order: 8, fillType: "solid", textColor: "#acbeff", borderColor: "#FFFFFF", borderWidth: 8 },
  { name: "Deep Topics", icon: "brain", colorPrimary: "#004a7e", colorSecondary: "#b3d4e8", order: 9, fillType: "solid", textColor: "#92d6ff", borderColor: "#FFFFFF", borderWidth: 8 },
];

const sampleQuestions = [
  { categoryId: 1, questionText: "How has your faith shaped who you are today?", isPremium: false },
  { categoryId: 1, questionText: "What role do you want faith to play in our future family?", isPremium: false },
  { categoryId: 1, questionText: "How do you envision us growing spiritually together?", isPremium: false },
  { categoryId: 1, questionText: "What spiritual practices are most meaningful to you?", isPremium: false },
  { categoryId: 1, questionText: "How do you handle doubt in your faith journey?", isPremium: false },
  
  { categoryId: 2, questionText: "Describe your relationship with your parents growing up.", isPremium: false },
  { categoryId: 2, questionText: "What traditions from your childhood would you like to continue?", isPremium: false },
  { categoryId: 2, questionText: "How has your family influenced your view of relationships?", isPremium: false },
  { categoryId: 2, questionText: "What role do you see extended family playing in our lives?", isPremium: false },
  { categoryId: 2, questionText: "How were emotions expressed in your household growing up?", isPremium: false },
  
  { categoryId: 3, questionText: "What does a successful marriage look like to you?", isPremium: false },
  { categoryId: 3, questionText: "How do you envision our roles in the household?", isPremium: false },
  { categoryId: 3, questionText: "What are your expectations around having children?", isPremium: false },
  { categoryId: 3, questionText: "How do you feel about maintaining individual friendships after marriage?", isPremium: false },
  { categoryId: 3, questionText: "What does commitment mean to you in marriage?", isPremium: false },
  
  { categoryId: 4, questionText: "How do you handle disagreements in relationships?", isPremium: false },
  { categoryId: 4, questionText: "What is your preferred way of receiving love and affirmation?", isPremium: false },
  { categoryId: 4, questionText: "How do you like to communicate during stressful times?", isPremium: false },
  { categoryId: 4, questionText: "What topics do you find difficult to discuss?", isPremium: false },
  { categoryId: 4, questionText: "How do you prefer to resolve misunderstandings?", isPremium: false },
  
  { categoryId: 5, questionText: "What are your views on saving vs. spending?", isPremium: false },
  { categoryId: 5, questionText: "How do you feel about combining finances after marriage?", isPremium: false },
  { categoryId: 5, questionText: "What are your thoughts on debt and borrowing?", isPremium: false },
  { categoryId: 5, questionText: "How do you envision making major financial decisions together?", isPremium: false },
  { categoryId: 5, questionText: "What role does generosity play in your financial philosophy?", isPremium: false },
  
  { categoryId: 6, questionText: "How important is physical touch in expressing love?", isPremium: false },
  { categoryId: 6, questionText: "What does emotional intimacy mean to you?", isPremium: false },
  { categoryId: 6, questionText: "How do you feel about discussing intimate topics openly?", isPremium: false },
  { categoryId: 6, questionText: "What boundaries are important to you before marriage?", isPremium: false },
  { categoryId: 6, questionText: "How do you envision keeping intimacy alive over the years?", isPremium: false },
  
  { categoryId: 7, questionText: "Where do you see yourself in 10 years?", isPremium: false },
  { categoryId: 7, questionText: "What are your career aspirations?", isPremium: false },
  { categoryId: 7, questionText: "What does success look like to you personally?", isPremium: false },
  { categoryId: 7, questionText: "How do you balance personal ambitions with relationship goals?", isPremium: false },
  { categoryId: 7, questionText: "What legacy do you want to leave behind?", isPremium: false },
  
  { categoryId: 8, questionText: "How do you typically react when you're upset?", isPremium: false },
  { categoryId: 8, questionText: "What do you need from a partner during conflict?", isPremium: false },
  { categoryId: 8, questionText: "How do you approach forgiveness?", isPremium: false },
  { categoryId: 8, questionText: "What are your deal-breakers in a relationship?", isPremium: false },
  { categoryId: 8, questionText: "How do you rebuild trust after it's been broken?", isPremium: false },
  
  { categoryId: 9, questionText: "What hobbies would you love to share with a partner?", isPremium: false },
  { categoryId: 9, questionText: "How do you prefer to spend weekends?", isPremium: false },
  { categoryId: 9, questionText: "What's your ideal vacation?", isPremium: false },
  { categoryId: 9, questionText: "How important is alone time to you?", isPremium: false },
  { categoryId: 9, questionText: "What brings you the most joy in life?", isPremium: false },
];

export async function seedDatabase() {
  console.log("Checking if database needs seeding...");
  
  try {
    const existingCategories = await db.select().from(categories);
    
    if (existingCategories.length === 0) {
      console.log("Seeding categories...");
      await db.insert(categories).values(defaultCategories);
      console.log("Categories seeded successfully!");
    } else {
      console.log("Categories already exist, skipping...");
    }
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
  
  try {
    const existingQuestions = await db.select().from(questions);
    
    if (existingQuestions.length === 0) {
      console.log("Seeding questions...");
      await db.insert(questions).values(sampleQuestions);
      console.log("Questions seeded successfully!");
    } else {
      console.log("Questions already exist, skipping...");
    }
  } catch (error) {
    console.error("Error seeding questions:", error);
  }
  
  try {
    const existingAdmin = await db.select().from(users).where(eq(users.email, "j.caspari@mail.de"));
    
    if (existingAdmin.length === 0) {
      console.log("Creating admin user...");
      const hashedPassword = await bcrypt.hash("deeper2024", 10);
      await db.insert(users).values({
        email: "j.caspari@mail.de",
        password: hashedPassword,
      });
      console.log("Admin user created! Email: j.caspari@mail.de, Password: deeper2024");
    } else {
      console.log("Admin user already exists, skipping...");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
  
  console.log("Database seeding complete!");
}
