import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { insertQuestionSchema, insertCategorySchema } from "@shared/schema";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    isAdmin: boolean;
  }
}

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be set");
  }
  
  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }
  
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      proxy: process.env.NODE_ENV === "production",
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
      },
    })
  );

  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/questions", async (req, res) => {
    try {
      const categoryIdsParam = req.query.categoryIds as string | undefined;
      let categoryIds: number[] | undefined;
      
      if (categoryIdsParam) {
        categoryIds = categoryIdsParam.split(",").map(id => parseInt(id, 10)).filter(id => !isNaN(id));
      }
      
      const questions = await storage.getQuestions(categoryIds);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
      
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      req.session.isAdmin = true;
      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ message: "Session save failed" });
        }
        res.json({ message: "Login successful", email: user.email });
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/admin/session", (req, res) => {
    res.json({ isAdmin: !!req.session.isAdmin });
  });

  app.get("/api/admin/dashboard", requireAdmin, async (req, res) => {
    try {
      const totalQuestions = await storage.getQuestionCount();
      const categories = await storage.getCategories();
      const questionsByCategory = await storage.getQuestionCountByCategory();
      
      const categoryStats = categories.map(cat => {
        const count = questionsByCategory.find(q => q.categoryId === cat.id)?.count || 0;
        return { category: cat, count };
      });
      
      res.json({
        totalQuestions,
        totalCategories: categories.length,
        categoryStats,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  app.get("/api/admin/questions", requireAdmin, async (req, res) => {
    try {
      const questions = await storage.getQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  app.post("/api/admin/questions", requireAdmin, async (req, res) => {
    try {
      const parsed = insertQuestionSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid question data", errors: parsed.error.errors });
      }
      
      const question = await storage.createQuestion(parsed.data);
      res.status(201).json(question);
    } catch (error) {
      res.status(500).json({ message: "Failed to create question" });
    }
  });

  app.put("/api/admin/questions/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const question = await storage.updateQuestion(id, req.body);
      
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      res.json(question);
    } catch (error) {
      res.status(500).json({ message: "Failed to update question" });
    }
  });

  app.delete("/api/admin/questions/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      await storage.deleteQuestion(id);
      res.json({ message: "Question deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete question" });
    }
  });

  app.post("/api/admin/questions/bulk", requireAdmin, async (req, res) => {
    try {
      const { questions: questionsData } = req.body;
      
      if (!Array.isArray(questionsData)) {
        return res.status(400).json({ message: "Questions must be an array" });
      }
      
      const validQuestions = [];
      const errors = [];
      
      for (let i = 0; i < questionsData.length; i++) {
        const parsed = insertQuestionSchema.safeParse(questionsData[i]);
        if (parsed.success) {
          validQuestions.push(parsed.data);
        } else {
          errors.push({ row: i + 1, errors: parsed.error.errors });
        }
      }
      
      if (validQuestions.length === 0) {
        return res.status(400).json({ message: "No valid questions found", errors });
      }
      
      const created = await storage.bulkCreateQuestions(validQuestions);
      res.status(201).json({ created: created.length, errors });
    } catch (error) {
      res.status(500).json({ message: "Failed to bulk create questions" });
    }
  });

  app.get("/api/admin/categories", requireAdmin, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.put("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const category = await storage.updateCategory(id, req.body);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.put("/api/admin/categories/:id/order", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { order } = req.body;
      
      if (typeof order !== "number") {
        return res.status(400).json({ message: "Order must be a number" });
      }
      
      const category = await storage.updateCategoryOrder(id, order);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to update category order" });
    }
  });

  return httpServer;
}
