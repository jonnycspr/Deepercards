export interface Category {
  id: number;
  name: string;
  icon: string;
  colorPrimary: string;
  colorSecondary: string;
  order: number;
}

export const defaultCategories: Category[] = [
  { id: 1, name: "Faith & Spirituality", icon: "✝", colorPrimary: "#6F3FF0", colorSecondary: "#F1E7FF", order: 1 },
  { id: 2, name: "Family & Upbringing", icon: "🏠", colorPrimary: "#FF66C4", colorSecondary: "#FFE5F4", order: 2 },
  { id: 3, name: "Marriage Expectations", icon: "💍", colorPrimary: "#FF8A66", colorSecondary: "#FFE1D2", order: 3 },
  { id: 4, name: "Communication", icon: "💬", colorPrimary: "#4DAAFF", colorSecondary: "#D6ECFF", order: 4 },
  { id: 5, name: "Finances", icon: "💰", colorPrimary: "#5EE6A8", colorSecondary: "#DDFBEF", order: 5 },
  { id: 6, name: "Intimacy", icon: "❤", colorPrimary: "#C084FF", colorSecondary: "#F3E8FF", order: 6 },
  { id: 7, name: "Life Goals", icon: "🎯", colorPrimary: "#1EC6C3", colorSecondary: "#D7F7F6", order: 7 },
  { id: 8, name: "Conflict Resolution", icon: "🤝", colorPrimary: "#FF9F4A", colorSecondary: "#FFE2C4", order: 8 },
  { id: 9, name: "Fun & Lifestyle", icon: "🌟", colorPrimary: "#FFD54A", colorSecondary: "#FFF4C2", order: 9 },
];

export interface Question {
  id: number;
  questionText: string;
  categoryId: number;
  isPremium: boolean;
}

// todo: remove mock functionality - these are sample questions for the prototype
export const mockQuestions: Question[] = [
  { id: 1, questionText: "How has your faith shaped who you are today?", categoryId: 1, isPremium: false },
  { id: 2, questionText: "What role do you want faith to play in our future family?", categoryId: 1, isPremium: false },
  { id: 3, questionText: "Describe your relationship with your parents growing up.", categoryId: 2, isPremium: false },
  { id: 4, questionText: "What traditions from your childhood would you like to continue?", categoryId: 2, isPremium: false },
  { id: 5, questionText: "What does a successful marriage look like to you?", categoryId: 3, isPremium: false },
  { id: 6, questionText: "How do you handle disagreements in relationships?", categoryId: 4, isPremium: false },
  { id: 7, questionText: "What are your views on saving vs. spending?", categoryId: 5, isPremium: false },
  { id: 8, questionText: "How important is physical touch in expressing love?", categoryId: 6, isPremium: false },
  { id: 9, questionText: "Where do you see yourself in 10 years?", categoryId: 7, isPremium: false },
  { id: 10, questionText: "How do you typically react when you're upset?", categoryId: 8, isPremium: false },
  { id: 11, questionText: "What hobbies would you love to share with a partner?", categoryId: 9, isPremium: false },
  { id: 12, questionText: "How do you prefer to spend weekends?", categoryId: 9, isPremium: false },
];
