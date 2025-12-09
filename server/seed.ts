import { db } from "./db";
import { categories, questions, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const defaultCategories = [
  { name: "Faith & Spirituality", icon: "✝", colorPrimary: "#6F3FF0", colorSecondary: "#F1E7FF", order: 1 },
  { name: "Family & Upbringing", icon: "🏠", colorPrimary: "#FF66C4", colorSecondary: "#FFE5F4", order: 2 },
  { name: "Marriage Expectations", icon: "💍", colorPrimary: "#FF8A66", colorSecondary: "#FFE1D2", order: 3 },
  { name: "Communication", icon: "💬", colorPrimary: "#4DAAFF", colorSecondary: "#D6ECFF", order: 4 },
  { name: "Finances", icon: "💰", colorPrimary: "#5EE6A8", colorSecondary: "#DDFBEF", order: 5 },
  { name: "Intimacy", icon: "❤", colorPrimary: "#C084FF", colorSecondary: "#F3E8FF", order: 6 },
  { name: "Life Goals", icon: "🎯", colorPrimary: "#1EC6C3", colorSecondary: "#D7F7F6", order: 7 },
  { name: "Conflict Resolution", icon: "🤝", colorPrimary: "#FF9F4A", colorSecondary: "#FFE2C4", order: 8 },
  { name: "Fun & Lifestyle", icon: "🌟", colorPrimary: "#FFD54A", colorSecondary: "#FFF4C2", order: 9 },
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
  
  const existingCategories = await db.select().from(categories);
  
  if (existingCategories.length === 0) {
    console.log("Seeding categories...");
    await db.insert(categories).values(defaultCategories);
    console.log("Categories seeded successfully!");
  } else {
    console.log("Categories already exist, skipping...");
  }
  
  const existingQuestions = await db.select().from(questions);
  
  if (existingQuestions.length === 0) {
    console.log("Seeding questions...");
    await db.insert(questions).values(sampleQuestions);
    console.log("Questions seeded successfully!");
  } else {
    console.log("Questions already exist, skipping...");
  }
  
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
  
  console.log("Database seeding complete!");
}
