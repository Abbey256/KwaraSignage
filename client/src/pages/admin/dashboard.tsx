import { useQuery } from "@tanstack/react-query";
import { StatsCards } from "@/components/admin/stats-cards";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import type { Billboard, DashboardStats } from "@/lib/types";

export default function AdminDashboard() {
  const { data: billboards = [] } = useQuery<Billboard[]>({
    queryKey: ["/api/billboards"],
  });

  const stats: DashboardStats = {
    totalBillboards: billboards.length,
    availableBillboards: billboards.filter((b) => b.status === "available").length,
    occupiedBillboards: billboards.filter((b) => b.status === "occupied").length,
    totalViews: billboards.reduce((sum, b) => sum + b.monthlyEstimatedViews, 0),
    pendingRequests: 5,
    weeklyGrowth: 12.5,
  };

  const dailyData = [
    { name: "Mon", views: 24500, previousViews: 22000 },
    { name: "Tue", views: 26800, previousViews: 24500 },
    { name: "Wed", views: 28200, previousViews: 25800 },
    { name: "Thu", views: 31000, previousViews: 27000 },
    { name: "Fri", views: 35400, previousViews: 30000 },
    { name: "Sat", views: 42000, previousViews: 38000 },
    { name: "Sun", views: 38500, previousViews: 35000 },
  ];

  const weeklyData = [
    { name: "Week 1", views: 185000 },
    { name: "Week 2", views: 198000 },
    { name: "Week 3", views: 215000 },
    { name: "Week 4", views: 226400 },
  ];

  const monthlyData = [
    { name: "Jan", views: 650000 },
    { name: "Feb", views: 720000 },
    { name: "Mar", views: 780000 },
    { name: "Apr", views: 850000 },
    { name: "May", views: 920000 },
    { name: "Jun", views: 980000 },
    { name: "Jul", views: 1050000 },
    { name: "Aug", views: 1120000 },
    { name: "Sep", views: 1080000 },
    { name: "Oct", views: 1150000 },
    { name: "Nov", views: 1220000 },
  ];

  const billboardDistribution = billboards
    .sort((a, b) => b.monthlyEstimatedViews - a.monthlyEstimatedViews)
    .slice(0, 5)
    .map((b) => ({
      name: b.name,
      value: b.monthlyEstimatedViews,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of billboard performance and analytics
        </p>
      </div>

      <StatsCards stats={stats} />

      <AnalyticsCharts
        dailyData={dailyData}
        weeklyData={weeklyData}
        monthlyData={monthlyData}
        billboardDistribution={billboardDistribution}
      />
    </div>
  );
}
