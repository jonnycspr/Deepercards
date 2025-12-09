export interface Category {
  id: number;
  name: string;
  icon: string;
  colorPrimary: string;
  colorSecondary: string;
  order: number;
  fillType?: string;
  gradientFrom?: string | null;
  gradientTo?: string | null;
  gradientAngle?: number | null;
  textColor?: string | null;
  borderColor?: string | null;
  borderWidth?: number | null;
  imageUrl?: string | null;
}

export const defaultCategories: Category[] = [
  { id: 1, name: "Character and Personality", icon: "person", colorPrimary: "#ff4d4f", colorSecondary: "#ffcccc", order: 1, fillType: "solid", textColor: "#bf0000", borderColor: "#FFFFFF", borderWidth: 8 },
  { id: 2, name: "Origin and Family", icon: "home", colorPrimary: "#ff8500", colorSecondary: "#ffe0b3", order: 2, fillType: "solid", textColor: "#d54900", borderColor: "#FFFFFF", borderWidth: 8 },
  { id: 3, name: "Humor and Joy", icon: "smile", colorPrimary: "#ffdc54", colorSecondary: "#fff4c2", order: 3, fillType: "solid", textColor: "#cda505", borderColor: "#FFFFFF", borderWidth: 8 },
  { id: 4, name: "Relationship and Communication", icon: "chat", colorPrimary: "#008475", colorSecondary: "#b3e0db", order: 4, fillType: "solid", textColor: "#43f2da", borderColor: "#FFFFFF", borderWidth: 8 },
  { id: 5, name: "Finances", icon: "wallet", colorPrimary: "#00c9b5", colorSecondary: "#b3f0e9", order: 5, fillType: "solid", textColor: "#195b5d", borderColor: "#FFFFFF", borderWidth: 8 },
  { id: 6, name: "Faith", icon: "heart", colorPrimary: "#9ed1d6", colorSecondary: "#d9eff1", order: 6, fillType: "solid", textColor: "#4b8085", borderColor: "#FFFFFF", borderWidth: 8 },
  { id: 7, name: "Sexuality", icon: "heart", colorPrimary: "#8253ee", colorSecondary: "#d9ccf9", order: 7, fillType: "solid", textColor: "#c6a8ff", borderColor: "#FFFFFF", borderWidth: 8 },
  { id: 8, name: "Future and Marriage", icon: "ring", colorPrimary: "#455fed", colorSecondary: "#c9d4f9", order: 8, fillType: "solid", textColor: "#acbeff", borderColor: "#FFFFFF", borderWidth: 8 },
  { id: 9, name: "Deep Topics", icon: "brain", colorPrimary: "#004a7e", colorSecondary: "#b3d4e8", order: 9, fillType: "solid", textColor: "#92d6ff", borderColor: "#FFFFFF", borderWidth: 8 },
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
