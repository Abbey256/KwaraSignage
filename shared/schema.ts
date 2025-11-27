import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("admin"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Billboards table
export const billboards = pgTable("billboards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  size: text("size").notNull(),
  imageUrl: text("image_url"),
  status: text("status").notNull().default("available"),
  dailyEstimatedViews: integer("daily_estimated_views").notNull().default(0),
  weeklyEstimatedViews: integer("weekly_estimated_views").notNull().default(0),
  monthlyEstimatedViews: integer("monthly_estimated_views").notNull().default(0),
  address: text("address"),
  description: text("description"),
});

export const insertBillboardSchema = createInsertSchema(billboards).omit({ id: true });
export type InsertBillboard = z.infer<typeof insertBillboardSchema>;
export type Billboard = typeof billboards.$inferSelect;

// Analytics table - stores timestamped people counts (no video storage for privacy)
export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  billboardId: varchar("billboard_id").notNull(),
  totalPeople: integer("total_people").notNull(),
  videoDuration: text("video_duration"),
  framesProcessed: integer("frames_processed"),
  processedAt: timestamp("processed_at").notNull().defaultNow(),
  hour: integer("hour"),
  dayOfWeek: integer("day_of_week"),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({ id: true, processedAt: true });
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;

// Requests table - booking inquiries from public
export const requests = pgTable("requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  billboardId: varchar("billboard_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  status: text("status").notNull().default("pending"),
});

export const insertRequestSchema = createInsertSchema(requests).omit({ id: true, submittedAt: true, status: true });
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type Request = typeof requests.$inferSelect;

// Video upload tracking (for processing status only - videos are deleted after processing)
export const videoProcessing = pgTable("video_processing", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  billboardId: varchar("billboard_id").notNull(),
  status: text("status").notNull().default("processing"),
  progress: integer("progress").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertVideoProcessingSchema = createInsertSchema(videoProcessing).omit({ id: true, createdAt: true, completedAt: true });
export type InsertVideoProcessing = z.infer<typeof insertVideoProcessingSchema>;
export type VideoProcessing = typeof videoProcessing.$inferSelect;
