import type { Billboard, Analytics, Request, User, VideoProcessing } from "@shared/schema";

export type { Billboard, Analytics, Request, User, VideoProcessing };

export interface DashboardStats {
  totalBillboards: number;
  availableBillboards: number;
  occupiedBillboards: number;
  totalViews: number;
  pendingRequests: number;
  weeklyGrowth: number;
}

export interface ChartDataPoint {
  date: string;
  views: number;
  label?: string;
}

export interface BillboardWithAnalytics extends Billboard {
  recentAnalytics?: Analytics[];
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Premium Billboard Locations",
    subtitle: "Reach thousands of potential customers across Kwara State",
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop"
  },
  {
    id: 2,
    title: "Data-Driven Advertising",
    subtitle: "Real-time analytics to measure your billboard performance",
    imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&h=1080&fit=crop"
  },
  {
    id: 3,
    title: "Strategic Locations",
    subtitle: "High-traffic areas in Ilorin and across Kwara State",
    imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&h=1080&fit=crop"
  }
];

export const sampleBillboards: Billboard[] = [
  {
    id: "1",
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
    description: "Prime location at the busiest intersection in Ilorin"
  },
  {
    id: "2",
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
    description: "High visibility location near major commercial hub"
  },
  {
    id: "3",
    name: "Taiwo Road Central",
    latitude: 8.4850,
    longitude: 4.5520,
    size: "32ft x 10ft",
    imageUrl: "https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=800&h=600&fit=crop",
    status: "available",
    dailyEstimatedViews: 18900,
    weeklyEstimatedViews: 132300,
    monthlyEstimatedViews: 567000,
    address: "Taiwo Road, Ilorin, Kwara State",
    description: "Central business district with premium foot traffic"
  },
  {
    id: "4",
    name: "GRA Entrance",
    latitude: 8.5010,
    longitude: 4.5680,
    size: "48ft x 14ft",
    imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=600&fit=crop",
    status: "available",
    dailyEstimatedViews: 9800,
    weeklyEstimatedViews: 68600,
    monthlyEstimatedViews: 294000,
    address: "GRA, Ilorin, Kwara State",
    description: "Upscale residential area targeting high-income demographics"
  },
  {
    id: "5",
    name: "Offa Garage Terminal",
    latitude: 8.4720,
    longitude: 4.5350,
    size: "40ft x 12ft",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
    status: "occupied",
    dailyEstimatedViews: 22100,
    weeklyEstimatedViews: 154700,
    monthlyEstimatedViews: 663000,
    address: "Offa Garage, Ilorin, Kwara State",
    description: "Major transportation hub with constant commuter traffic"
  },
  {
    id: "6",
    name: "University Road",
    latitude: 8.4580,
    longitude: 4.5680,
    size: "36ft x 11ft",
    imageUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&h=600&fit=crop",
    status: "available",
    dailyEstimatedViews: 14200,
    weeklyEstimatedViews: 99400,
    monthlyEstimatedViews: 426000,
    address: "University Road, Ilorin, Kwara State",
    description: "Near University of Ilorin, targeting student and faculty demographics"
  }
];
