import {
  type User,
  type InsertUser,
  type Billboard,
  type InsertBillboard,
  type Analytics,
  type InsertAnalytics,
  type Request,
  type InsertRequest,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Billboards
  getBillboards(): Promise<Billboard[]>;
  getBillboard(id: string): Promise<Billboard | undefined>;
  createBillboard(billboard: InsertBillboard): Promise<Billboard>;
  updateBillboard(id: string, billboard: Partial<InsertBillboard>): Promise<Billboard | undefined>;
  deleteBillboard(id: string): Promise<boolean>;

  // Analytics
  getAnalytics(billboardId?: string): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;

  // Requests
  getRequests(): Promise<Request[]>;
  getRequest(id: string): Promise<Request | undefined>;
  createRequest(request: InsertRequest): Promise<Request>;
  updateRequestStatus(id: string, status: string): Promise<Request | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private billboards: Map<string, Billboard>;
  private analytics: Map<string, Analytics>;
  private requests: Map<string, Request>;

  constructor() {
    this.users = new Map();
    this.billboards = new Map();
    this.analytics = new Map();
    this.requests = new Map();

    // Initialize with default admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@kwarastate.gov.ng",
      role: "admin",
    });

    // Initialize with sample billboards
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleBillboards: InsertBillboard[] = [
      {
        name: "Unity Road Junction",
        latitude: 8.4966,
        longitude: 4.5421,
        size: "48ft x 14ft",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        status: "available",
        dailyEstimatedViews: 15420,
        weeklyEstimatedViews: 107940,
        monthlyEstimatedViews: 462600,
        address: "Unity Road, Ilorin, Kwara State",
        description: "Prime location at the busiest intersection in Ilorin",
      },
      {
        name: "Challenge Roundabout",
        latitude: 8.4799,
        longitude: 4.5418,
        size: "40ft x 12ft",
        imageUrl: "https://images.unsplash.com/photo-1528658614691-3d1eb1dbe8c2?w=800&h=600&fit=crop",
        status: "occupied",
        dailyEstimatedViews: 12350,
        weeklyEstimatedViews: 86450,
        monthlyEstimatedViews: 370500,
        address: "Challenge Area, Ilorin, Kwara State",
        description: "High visibility location near major commercial hub",
      },
      {
        name: "Taiwo Road Central",
        latitude: 8.485,
        longitude: 4.552,
        size: "32ft x 10ft",
        imageUrl: "https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=800&h=600&fit=crop",
        status: "available",
        dailyEstimatedViews: 18900,
        weeklyEstimatedViews: 132300,
        monthlyEstimatedViews: 567000,
        address: "Taiwo Road, Ilorin, Kwara State",
        description: "Central business district with premium foot traffic",
      },
      {
        name: "GRA Entrance",
        latitude: 8.501,
        longitude: 4.568,
        size: "48ft x 14ft",
        imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=600&fit=crop",
        status: "available",
        dailyEstimatedViews: 9800,
        weeklyEstimatedViews: 68600,
        monthlyEstimatedViews: 294000,
        address: "GRA, Ilorin, Kwara State",
        description: "Upscale residential area targeting high-income demographics",
      },
      {
        name: "Offa Garage Terminal",
        latitude: 8.472,
        longitude: 4.535,
        size: "40ft x 12ft",
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
        status: "occupied",
        dailyEstimatedViews: 22100,
        weeklyEstimatedViews: 154700,
        monthlyEstimatedViews: 663000,
        address: "Offa Garage, Ilorin, Kwara State",
        description: "Major transportation hub with constant commuter traffic",
      },
      {
        name: "University Road",
        latitude: 8.458,
        longitude: 4.568,
        size: "36ft x 11ft",
        imageUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&h=600&fit=crop",
        status: "available",
        dailyEstimatedViews: 14200,
        weeklyEstimatedViews: 99400,
        monthlyEstimatedViews: 426000,
        address: "University Road, Ilorin, Kwara State",
        description: "Near University of Ilorin, targeting student and faculty demographics",
      },
    ];

    sampleBillboards.forEach((billboard) => {
      this.createBillboard(billboard);
    });

    // Add sample requests
    const sampleRequests: InsertRequest[] = [
      {
        billboardId: Array.from(this.billboards.keys())[0],
        name: "Adebayo Ogunleye",
        email: "adebayo@example.com",
        phone: "+234 803 123 4567",
        message: "I would like to advertise my new restaurant opening on this billboard for 3 months.",
      },
      {
        billboardId: Array.from(this.billboards.keys())[2],
        name: "Fatima Ibrahim",
        email: "fatima@company.ng",
        phone: "+234 805 987 6543",
        message: "Looking to promote our fashion brand during the festive season.",
      },
      {
        billboardId: Array.from(this.billboards.keys())[3],
        name: "Chukwuemeka Okoro",
        email: "cokoro@business.com",
        phone: "+234 802 456 7890",
        message: "Interested in long-term advertising for my car dealership.",
      },
    ];

    sampleRequests.forEach((request, index) => {
      const req = this.createRequest(request);
      if (index === 1) {
        this.updateRequestStatus(req.id, "approved");
      }
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Billboards
  async getBillboards(): Promise<Billboard[]> {
    return Array.from(this.billboards.values());
  }

  async getBillboard(id: string): Promise<Billboard | undefined> {
    return this.billboards.get(id);
  }

  async createBillboard(insertBillboard: InsertBillboard): Promise<Billboard> {
    const id = randomUUID();
    const billboard: Billboard = {
      id,
      name: insertBillboard.name,
      latitude: insertBillboard.latitude,
      longitude: insertBillboard.longitude,
      size: insertBillboard.size,
      imageUrl: insertBillboard.imageUrl || null,
      status: insertBillboard.status || "available",
      dailyEstimatedViews: insertBillboard.dailyEstimatedViews || 0,
      weeklyEstimatedViews: insertBillboard.weeklyEstimatedViews || 0,
      monthlyEstimatedViews: insertBillboard.monthlyEstimatedViews || 0,
      address: insertBillboard.address || null,
      description: insertBillboard.description || null,
    };
    this.billboards.set(id, billboard);
    return billboard;
  }

  async updateBillboard(id: string, updates: Partial<InsertBillboard>): Promise<Billboard | undefined> {
    const billboard = this.billboards.get(id);
    if (!billboard) return undefined;

    const updated: Billboard = { ...billboard, ...updates };
    this.billboards.set(id, updated);
    return updated;
  }

  async deleteBillboard(id: string): Promise<boolean> {
    return this.billboards.delete(id);
  }

  // Analytics
  async getAnalytics(billboardId?: string): Promise<Analytics[]> {
    const all = Array.from(this.analytics.values());
    if (billboardId) {
      return all.filter((a) => a.billboardId === billboardId);
    }
    return all;
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = randomUUID();
    const now = new Date();
    const analytics: Analytics = {
      id,
      billboardId: insertAnalytics.billboardId,
      totalPeople: insertAnalytics.totalPeople,
      videoDuration: insertAnalytics.videoDuration || null,
      framesProcessed: insertAnalytics.framesProcessed || null,
      processedAt: now,
      hour: insertAnalytics.hour || now.getHours(),
      dayOfWeek: insertAnalytics.dayOfWeek || now.getDay(),
    };
    this.analytics.set(id, analytics);

    // Update billboard estimated views based on new analytics
    const billboard = this.billboards.get(insertAnalytics.billboardId);
    if (billboard) {
      const totalPeople = insertAnalytics.totalPeople;
      billboard.dailyEstimatedViews = billboard.dailyEstimatedViews + totalPeople;
      billboard.weeklyEstimatedViews = billboard.weeklyEstimatedViews + totalPeople;
      billboard.monthlyEstimatedViews = billboard.monthlyEstimatedViews + totalPeople;
      this.billboards.set(billboard.id, billboard);
    }

    return analytics;
  }

  // Requests
  async getRequests(): Promise<Request[]> {
    return Array.from(this.requests.values()).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  async getRequest(id: string): Promise<Request | undefined> {
    return this.requests.get(id);
  }

  async createRequest(insertRequest: InsertRequest): Promise<Request> {
    const id = randomUUID();
    const request: Request = {
      id,
      billboardId: insertRequest.billboardId,
      name: insertRequest.name,
      email: insertRequest.email,
      phone: insertRequest.phone,
      message: insertRequest.message || null,
      submittedAt: new Date(),
      status: "pending",
    };
    this.requests.set(id, request);
    return request;
  }

  async updateRequestStatus(id: string, status: string): Promise<Request | undefined> {
    const request = this.requests.get(id);
    if (!request) return undefined;

    request.status = status;
    this.requests.set(id, request);
    return request;
  }
}

export const storage = new MemStorage();
