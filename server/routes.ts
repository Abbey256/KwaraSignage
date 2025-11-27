import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBillboardSchema, insertRequestSchema, insertAnalyticsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ============ AUTH ROUTES ============
  
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);

      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Don't return the password
      const { password: _, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============ BILLBOARD ROUTES ============

  app.get("/api/billboards", async (req: Request, res: Response) => {
    try {
      const billboards = await storage.getBillboards();
      return res.json(billboards);
    } catch (error) {
      console.error("Get billboards error:", error);
      return res.status(500).json({ message: "Failed to fetch billboards" });
    }
  });

  app.get("/api/billboards/:id", async (req: Request, res: Response) => {
    try {
      const billboard = await storage.getBillboard(req.params.id);
      if (!billboard) {
        return res.status(404).json({ message: "Billboard not found" });
      }
      return res.json(billboard);
    } catch (error) {
      console.error("Get billboard error:", error);
      return res.status(500).json({ message: "Failed to fetch billboard" });
    }
  });

  app.post("/api/billboards", async (req: Request, res: Response) => {
    try {
      const validatedData = insertBillboardSchema.parse(req.body);
      const billboard = await storage.createBillboard(validatedData);
      return res.status(201).json(billboard);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create billboard error:", error);
      return res.status(500).json({ message: "Failed to create billboard" });
    }
  });

  app.patch("/api/billboards/:id", async (req: Request, res: Response) => {
    try {
      const billboard = await storage.updateBillboard(req.params.id, req.body);
      if (!billboard) {
        return res.status(404).json({ message: "Billboard not found" });
      }
      return res.json(billboard);
    } catch (error) {
      console.error("Update billboard error:", error);
      return res.status(500).json({ message: "Failed to update billboard" });
    }
  });

  app.delete("/api/billboards/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteBillboard(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Billboard not found" });
      }
      return res.status(204).send();
    } catch (error) {
      console.error("Delete billboard error:", error);
      return res.status(500).json({ message: "Failed to delete billboard" });
    }
  });

  // ============ ANALYTICS ROUTES ============

  app.get("/api/analytics", async (req: Request, res: Response) => {
    try {
      const billboardId = req.query.billboardId as string | undefined;
      const analytics = await storage.getAnalytics(billboardId);
      return res.json(analytics);
    } catch (error) {
      console.error("Get analytics error:", error);
      return res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/analytics/:billboardId", async (req: Request, res: Response) => {
    try {
      const analytics = await storage.getAnalytics(req.params.billboardId);
      return res.json(analytics);
    } catch (error) {
      console.error("Get analytics error:", error);
      return res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.post("/api/analytics", async (req: Request, res: Response) => {
    try {
      const validatedData = insertAnalyticsSchema.parse(req.body);
      const analytics = await storage.createAnalytics(validatedData);
      return res.status(201).json(analytics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create analytics error:", error);
      return res.status(500).json({ message: "Failed to create analytics" });
    }
  });

  // ============ REQUEST ROUTES ============

  app.get("/api/requests", async (req: Request, res: Response) => {
    try {
      const requests = await storage.getRequests();
      return res.json(requests);
    } catch (error) {
      console.error("Get requests error:", error);
      return res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.get("/api/requests/:id", async (req: Request, res: Response) => {
    try {
      const request = await storage.getRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      return res.json(request);
    } catch (error) {
      console.error("Get request error:", error);
      return res.status(500).json({ message: "Failed to fetch request" });
    }
  });

  app.post("/api/requests", async (req: Request, res: Response) => {
    try {
      const validatedData = insertRequestSchema.parse(req.body);
      const request = await storage.createRequest(validatedData);
      return res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create request error:", error);
      return res.status(500).json({ message: "Failed to create request" });
    }
  });

  app.patch("/api/requests/:id", async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      if (!status || !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const request = await storage.updateRequestStatus(req.params.id, status);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      return res.json(request);
    } catch (error) {
      console.error("Update request error:", error);
      return res.status(500).json({ message: "Failed to update request" });
    }
  });

  // ============ VIDEO UPLOAD & PROCESSING ROUTE ============
  // Note: This simulates video processing for the MVP
  // In production, this would connect to the Python AI service

  app.post("/api/upload-video", async (req: Request, res: Response) => {
    try {
      const { billboardId } = req.body;

      if (!billboardId) {
        return res.status(400).json({ message: "Billboard ID is required" });
      }

      const billboard = await storage.getBillboard(billboardId);
      if (!billboard) {
        return res.status(404).json({ message: "Billboard not found" });
      }

      // Simulate AI processing - in production this would call the Python service
      // The video would be processed and immediately deleted for privacy
      const simulatedResult = {
        totalPeople: Math.floor(billboard.dailyEstimatedViews * (0.8 + Math.random() * 0.4)),
        videoDuration: `${Math.floor(Math.random() * 10 + 1)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
        framesProcessed: Math.floor(Math.random() * 5000 + 1000),
      };

      // Save analytics
      const analytics = await storage.createAnalytics({
        billboardId,
        totalPeople: simulatedResult.totalPeople,
        videoDuration: simulatedResult.videoDuration,
        framesProcessed: simulatedResult.framesProcessed,
      });

      return res.json({
        message: "Video processed successfully",
        analytics,
        result: simulatedResult,
      });
    } catch (error) {
      console.error("Video upload error:", error);
      return res.status(500).json({ message: "Failed to process video" });
    }
  });

  // ============ DASHBOARD STATS ROUTE ============

  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const billboards = await storage.getBillboards();
      const requests = await storage.getRequests();

      const stats = {
        totalBillboards: billboards.length,
        availableBillboards: billboards.filter((b) => b.status === "available").length,
        occupiedBillboards: billboards.filter((b) => b.status === "occupied").length,
        totalViews: billboards.reduce((sum, b) => sum + b.monthlyEstimatedViews, 0),
        pendingRequests: requests.filter((r) => r.status === "pending").length,
        weeklyGrowth: 12.5, // Placeholder - would calculate from real analytics
      };

      return res.json(stats);
    } catch (error) {
      console.error("Get stats error:", error);
      return res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  return httpServer;
}
