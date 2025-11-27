import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Users, Calendar, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Billboard } from "@/lib/types";

const createCustomIcon = (status: string) => {
  const color = status === "available" ? "#0AA344" : "#6B7280";
  
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background-color: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 3px solid white;
      ">
        <svg style="transform: rotate(45deg); width: 18px; height: 18px; color: white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  const initialCenter = useRef(center);
  
  useEffect(() => {
    map.setView(initialCenter.current, 13);
  }, [map]);
  
  return null;
}

interface BillboardMapProps {
  billboards: Billboard[];
  onRequestClick?: (billboard: Billboard) => void;
  selectedBillboard?: Billboard | null;
  className?: string;
}

export function BillboardMap({ 
  billboards, 
  onRequestClick,
  selectedBillboard,
  className = "" 
}: BillboardMapProps) {
  const center: [number, number] = selectedBillboard 
    ? [selectedBillboard.latitude, selectedBillboard.longitude]
    : [8.4799, 4.5418];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border border-border ${className}`}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ minHeight: "500px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={center} />
        
        {billboards.map((billboard) => (
          <Marker
            key={billboard.id}
            position={[billboard.latitude, billboard.longitude]}
            icon={createCustomIcon(billboard.status)}
          >
            <Popup className="billboard-popup" maxWidth={320} minWidth={280}>
              <div className="p-1">
                {billboard.imageUrl && (
                  <div className="mb-3 overflow-hidden rounded-lg">
                    <img
                      src={billboard.imageUrl}
                      alt={billboard.name}
                      className="h-32 w-full object-cover"
                    />
                  </div>
                )}
                
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground">{billboard.name}</h3>
                  <Badge
                    className={`shrink-0 text-xs ${
                      billboard.status === "available"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {billboard.status === "available" ? "Available" : "Occupied"}
                  </Badge>
                </div>

                <div className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{billboard.address || "Ilorin, Kwara State"}</span>
                </div>

                <div className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="font-medium">Size:</span>
                  <span>{billboard.size}</span>
                </div>

                <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3 text-primary" />
                    <span>Daily: <strong className="text-foreground">{formatNumber(billboard.dailyEstimatedViews)}</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3 text-primary" />
                    <span>Monthly: <strong className="text-foreground">{formatNumber(billboard.monthlyEstimatedViews)}</strong></span>
                  </div>
                </div>

                {billboard.status === "available" && onRequestClick && (
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => onRequestClick(billboard)}
                  >
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Request Billboard
                  </Button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute bottom-4 left-4 z-[1000] rounded-lg border border-border bg-background/95 p-3 backdrop-blur-sm">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Legend
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-xs">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted-foreground" />
            <span className="text-xs">Occupied</span>
          </div>
        </div>
      </div>
    </div>
  );
}
