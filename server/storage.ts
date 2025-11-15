import { type User, type InsertUser, type Threat, type InsertThreat } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Threat operations
  getAllThreats(): Promise<Threat[]>;
  getThreat(id: string): Promise<Threat | undefined>;
  createThreat(threat: InsertThreat): Promise<Threat>;
  deleteThreat(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private threats: Map<string, Threat>;

  constructor() {
    this.users = new Map();
    this.threats = new Map();
    this.seedThreats();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllThreats(): Promise<Threat[]> {
    return Array.from(this.threats.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getThreat(id: string): Promise<Threat | undefined> {
    return this.threats.get(id);
  }

  async createThreat(insertThreat: InsertThreat): Promise<Threat> {
    const id = randomUUID();
    const threat: Threat = {
      ...insertThreat,
      id,
      timestamp: new Date(),
    };
    this.threats.set(id, threat);
    return threat;
  }

  async deleteThreat(id: string): Promise<boolean> {
    return this.threats.delete(id);
  }

  private seedThreats(): void {
    const sampleThreats: InsertThreat[] = [
      {
        ip: "192.168.1.105",
        type: "SQL Injection",
        severity: "critical",
        country: "Russia",
        details: "Multiple SQL injection attempts detected on login endpoint",
        score: 95,
        latitude: "55.7558",
        longitude: "37.6173",
      },
      {
        ip: "45.142.212.67",
        type: "DDoS Attack",
        severity: "high",
        country: "China",
        details: "High volume of requests from single IP address",
        score: 88,
        latitude: "39.9042",
        longitude: "116.4074",
      },
      {
        ip: "103.251.167.10",
        type: "Brute Force",
        severity: "high",
        country: "North Korea",
        details: "Failed authentication attempts on admin panel",
        score: 82,
        latitude: "39.0392",
        longitude: "125.7625",
      },
      {
        ip: "185.220.101.34",
        type: "Port Scanning",
        severity: "medium",
        country: "Netherlands",
        details: "Systematic port scanning detected",
        score: 65,
        latitude: "52.3676",
        longitude: "4.9041",
      },
      {
        ip: "201.20.109.45",
        type: "Malware Distribution",
        severity: "critical",
        country: "Brazil",
        details: "Suspicious file downloads with malware signatures",
        score: 92,
        latitude: "-23.5505",
        longitude: "-46.6333",
      },
      {
        ip: "91.203.5.165",
        type: "XSS Attack",
        severity: "medium",
        country: "Ukraine",
        details: "Cross-site scripting attempts in form inputs",
        score: 58,
        latitude: "50.4501",
        longitude: "30.5234",
      },
      {
        ip: "118.27.34.89",
        type: "Data Exfiltration",
        severity: "critical",
        country: "China",
        details: "Unusual data transfer patterns detected",
        score: 90,
        latitude: "31.2304",
        longitude: "121.4737",
      },
      {
        ip: "195.123.237.89",
        type: "Phishing Attempt",
        severity: "high",
        country: "Iran",
        details: "Credential harvesting detected on fake login page",
        score: 78,
        latitude: "35.6892",
        longitude: "51.3890",
      },
      {
        ip: "212.102.56.78",
        type: "Unauthorized Access",
        severity: "medium",
        country: "Turkey",
        details: "Access attempts to restricted resources",
        score: 62,
        latitude: "41.0082",
        longitude: "28.9784",
      },
      {
        ip: "203.0.113.42",
        type: "API Abuse",
        severity: "low",
        country: "United States",
        details: "Rate limit exceeded on public API endpoints",
        score: 35,
        latitude: "37.7749",
        longitude: "-122.4194",
      },
      {
        ip: "172.16.254.1",
        type: "Command Injection",
        severity: "high",
        country: "Russia",
        details: "Shell command injection attempts detected",
        score: 85,
        latitude: "59.9343",
        longitude: "30.3351",
      },
      {
        ip: "198.51.100.23",
        type: "Session Hijacking",
        severity: "medium",
        country: "Germany",
        details: "Suspicious session token manipulation",
        score: 68,
        latitude: "52.5200",
        longitude: "13.4050",
      },
    ];

    sampleThreats.forEach((threat) => {
      const id = randomUUID();
      const fullThreat: Threat = {
        ...threat,
        id,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      };
      this.threats.set(id, fullThreat);
    });
  }
}

export const storage = new MemStorage();
