import { useQuery } from "@tanstack/react-query";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import type { Billboard } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function AdminAnalytics() {
  const [selectedBillboard, setSelectedBillboard] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7d");
  const { toast } = useToast();

  const { data: billboards = [] } = useQuery<Billboard[]>({
    queryKey: ["/api/billboards"],
  });

  const generateDailyData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((name) => ({
      name,
      views: Math.floor(Math.random() * 15000 + 20000),
      previousViews: Math.floor(Math.random() * 12000 + 18000),
    }));
  };

  const generateWeeklyData = () => {
    return [
      { name: "Week 1", views: Math.floor(Math.random() * 50000 + 150000) },
      { name: "Week 2", views: Math.floor(Math.random() * 50000 + 160000) },
      { name: "Week 3", views: Math.floor(Math.random() * 50000 + 180000) },
      { name: "Week 4", views: Math.floor(Math.random() * 50000 + 200000) },
    ];
  };

  const generateMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
    return months.map((name) => ({
      name,
      views: Math.floor(Math.random() * 300000 + 700000),
    }));
  };

  const billboardDistribution = billboards
    .sort((a, b) => b.monthlyEstimatedViews - a.monthlyEstimatedViews)
    .slice(0, 5)
    .map((b) => ({
      name: b.name,
      value: b.monthlyEstimatedViews,
    }));

  const exportAnalytics = () => {
    const headers = ["Date", "Billboard", "Views", "Period"];
    const data = generateDailyData().map((d) => [
      format(new Date(), "yyyy-MM-dd"),
      selectedBillboard === "all" ? "All Billboards" : billboards.find(b => b.id === selectedBillboard)?.name || "Unknown",
      d.views.toString(),
      "Daily",
    ]);

    const csvContent = [
      headers.join(","),
      ...data.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Analytics data exported to CSV file.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            View detailed analytics and traffic patterns
          </p>
        </div>
        <Button variant="outline" onClick={exportAnalytics} data-testid="button-export-analytics">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium">Billboard</label>
              <Select value={selectedBillboard} onValueChange={setSelectedBillboard}>
                <SelectTrigger data-testid="select-analytics-billboard">
                  <SelectValue placeholder="Select billboard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Billboards</SelectItem>
                  {billboards.map((billboard) => (
                    <SelectItem key={billboard.id} value={billboard.id}>
                      {billboard.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger data-testid="select-date-range">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {(billboards.reduce((sum, b) => sum + b.dailyEstimatedViews, 0)).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Daily Average Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {(billboards.reduce((sum, b) => sum + b.weeklyEstimatedViews, 0)).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Weekly Total Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {(billboards.reduce((sum, b) => sum + b.monthlyEstimatedViews, 0)).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Monthly Total Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">+12.5%</div>
            <p className="text-sm text-muted-foreground">Growth Rate</p>
          </CardContent>
        </Card>
      </div>

      <AnalyticsCharts
        dailyData={generateDailyData()}
        weeklyData={generateWeeklyData()}
        monthlyData={generateMonthlyData()}
        billboardDistribution={billboardDistribution}
      />
    </div>
  );
}
