import { MapPin, CheckCircle, XCircle, Users, MessageSquare, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";

interface StatsCardsProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Billboards",
      value: stats.totalBillboards,
      icon: MapPin,
      description: "Active billboard locations",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Available",
      value: stats.availableBillboards,
      icon: CheckCircle,
      description: "Ready for booking",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Occupied",
      value: stats.occupiedBillboards,
      icon: XCircle,
      description: "Currently in use",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Total Views",
      value: formatNumber(stats.totalViews),
      icon: Users,
      description: "Monthly estimated views",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: MessageSquare,
      description: "Awaiting review",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Weekly Growth",
      value: `${stats.weeklyGrowth > 0 ? "+" : ""}${stats.weeklyGrowth}%`,
      icon: TrendingUp,
      description: "Compared to last week",
      color: stats.weeklyGrowth >= 0 ? "text-green-500" : "text-red-500",
      bgColor: stats.weeklyGrowth >= 0 ? "bg-green-500/10" : "bg-red-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title} data-testid={`card-stat-${card.title.toLowerCase().replace(" ", "-")}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse rounded bg-muted" />
            ) : (
              <div className="text-2xl font-bold">{card.value}</div>
            )}
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
