import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertThreatSchema } from "@shared/schema";
import {
  generateThreatExplanation,
  generateImpactRating,
  suggestResponseSteps,
  detectAnomalies,
  performIPLookup,
} from "./ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all threats
  app.get("/api/threats", async (req, res) => {
    try {
      const threats = await storage.getAllThreats();
      res.json(threats);
    } catch (error) {
      console.error("Error fetching threats:", error);
      res.status(500).json({ error: "Failed to fetch threats" });
    }
  });

  // Get single threat
  app.get("/api/threats/:id", async (req, res) => {
    try {
      const threat = await storage.getThreat(req.params.id);
      if (!threat) {
        return res.status(404).json({ error: "Threat not found" });
      }
      res.json(threat);
    } catch (error) {
      console.error("Error fetching threat:", error);
      res.status(500).json({ error: "Failed to fetch threat" });
    }
  });

  // Create new threat
  app.post("/api/threats", async (req, res) => {
    try {
      const validatedData = insertThreatSchema.parse(req.body);
      const threat = await storage.createThreat(validatedData);
      res.status(201).json(threat);
    } catch (error) {
      console.error("Error creating threat:", error);
      res.status(400).json({ error: "Invalid threat data" });
    }
  });

  // Delete threat
  app.delete("/api/threats/:id", async (req, res) => {
    try {
      const success = await storage.deleteThreat(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Threat not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting threat:", error);
      res.status(500).json({ error: "Failed to delete threat" });
    }
  });

  // AI: Explain threat
  app.post("/api/ai/explain", async (req, res) => {
    try {
      const { threat } = req.body;
      if (!threat || !threat.ip || !threat.type || !threat.severity) {
        return res.status(400).json({ error: "Valid threat data required (ip, type, severity)" });
      }
      const explanation = generateThreatExplanation(threat);
      res.json(explanation);
    } catch (error) {
      console.error("Error generating explanation:", error);
      res.status(500).json({ error: "Failed to generate explanation" });
    }
  });

  // AI: Calculate impact rating
  app.post("/api/ai/impact", async (req, res) => {
    try {
      const { threat } = req.body;
      if (!threat || !threat.ip || !threat.type || !threat.severity) {
        return res.status(400).json({ error: "Valid threat data required (ip, type, severity)" });
      }
      const impact = generateImpactRating(threat);
      res.json(impact);
    } catch (error) {
      console.error("Error calculating impact:", error);
      res.status(500).json({ error: "Failed to calculate impact" });
    }
  });

  // AI: Generate response steps
  app.post("/api/ai/response", async (req, res) => {
    try {
      const { threat } = req.body;
      if (!threat || !threat.ip || !threat.type || !threat.severity) {
        return res.status(400).json({ error: "Valid threat data required (ip, type, severity)" });
      }
      const steps = suggestResponseSteps(threat);
      res.json({ steps });
    } catch (error) {
      console.error("Error generating response:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // AI: Detect anomalies
  app.post("/api/ai/anomalies", async (req, res) => {
    try {
      const { threats } = req.body;
      if (!threats || !Array.isArray(threats)) {
        return res.status(400).json({ error: "Threats array required" });
      }
      const analysis = detectAnomalies(threats);
      res.json(analysis);
    } catch (error) {
      console.error("Error detecting anomalies:", error);
      res.status(500).json({ error: "Failed to detect anomalies" });
    }
  });

  // IP Lookup
  app.post("/api/iplookup", async (req, res) => {
    try {
      const { ip } = req.body;
      if (!ip) {
        return res.status(400).json({ error: "IP address required" });
      }

      // Basic IP validation
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipRegex.test(ip)) {
        return res.status(400).json({ error: "Invalid IP address format" });
      }

      const result = performIPLookup(ip);
      res.json(result);
    } catch (error) {
      console.error("Error performing IP lookup:", error);
      res.status(500).json({ error: "Failed to perform IP lookup" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
