import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const threats = pgTable("threats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ip: text("ip").notNull(),
  type: text("type").notNull(),
  severity: text("severity").notNull(),
  country: text("country"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  details: text("details"),
  score: integer("score"),
  latitude: text("latitude"),
  longitude: text("longitude"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertThreatSchema = createInsertSchema(threats).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertThreat = z.infer<typeof insertThreatSchema>;
export type Threat = typeof threats.$inferSelect;

// AI Insight types
export interface ThreatExplanation {
  threat: Threat;
  explanation: string;
  impactRating: number;
  responseSteps: string[];
}

export interface IPLookupResult {
  ip: string;
  country: string;
  isp: string;
  asn: string;
  riskScore: number;
  aiSummary: string;
}

export interface AnomalyAnalysis {
  detected: boolean;
  anomalies: string[];
  confidence: number;
  recommendation: string;
}
