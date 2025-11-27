import { MapPin, Users, Calendar, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Billboard } from "@/lib/types";

interface BillboardCardProps {
  billboard: Billboard;
  onRequestClick?: (billboard: Billboard) => void;
}

export function BillboardCard({ billboard, onRequestClick }: BillboardCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" data-testid={`card-billboard-${billboard.id}`}>
      <div className="relative aspect-video overflow-hidden">
        {billboard.imageUrl ? (
          <img
            src={billboard.imageUrl}
            alt={billboard.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <MapPin className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <Badge
          className={`absolute right-3 top-3 ${
            billboard.status === "available"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
          data-testid={`badge-status-${billboard.id}`}
        >
          {billboard.status === "available" ? "Available" : "Occupied"}
        </Badge>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="mb-1 text-lg font-semibold text-white">{billboard.name}</h3>
          <div className="flex items-center gap-1 text-sm text-white/80">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{billboard.address || "Ilorin, Kwara State"}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {billboard.size}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>
              {billboard.latitude.toFixed(4)}, {billboard.longitude.toFixed(4)}
            </span>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-muted p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              Daily
            </div>
            <div className="text-sm font-semibold" data-testid={`text-daily-views-${billboard.id}`}>
              {formatNumber(billboard.dailyEstimatedViews)}
            </div>
          </div>
          <div className="rounded-lg bg-muted p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Weekly
            </div>
            <div className="text-sm font-semibold" data-testid={`text-weekly-views-${billboard.id}`}>
              {formatNumber(billboard.weeklyEstimatedViews)}
            </div>
          </div>
          <div className="rounded-lg bg-muted p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Monthly
            </div>
            <div className="text-sm font-semibold" data-testid={`text-monthly-views-${billboard.id}`}>
              {formatNumber(billboard.monthlyEstimatedViews)}
            </div>
          </div>
        </div>

        {billboard.description && (
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
            {billboard.description}
          </p>
        )}

        <Button
          className="w-full"
          variant={billboard.status === "available" ? "default" : "secondary"}
          disabled={billboard.status !== "available"}
          onClick={() => onRequestClick?.(billboard)}
          data-testid={`button-request-${billboard.id}`}
        >
          <Users className="mr-2 h-4 w-4" />
          {billboard.status === "available" ? "Request This Billboard" : "Currently Occupied"}
        </Button>
      </CardContent>
    </Card>
  );
}
