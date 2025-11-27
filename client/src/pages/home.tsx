import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, BarChart3, Shield, Clock, Loader2 } from "lucide-react";
import { PublicNavbar } from "@/components/public-navbar";
import { PublicFooter } from "@/components/public-footer";
import { HeroSection } from "@/components/hero-section";
import { BillboardCard } from "@/components/billboard-card";
import { BillboardMap } from "@/components/billboard-map";
import { ContactForm } from "@/components/contact-form";
import type { Billboard } from "@/lib/types";

export default function Home() {
  const [selectedBillboard, setSelectedBillboard] = useState<Billboard | null>(null);

  const { data: billboards = [], isLoading } = useQuery<Billboard[]>({
    queryKey: ["/api/billboards"],
  });

  const handleRequestClick = (billboard: Billboard) => {
    setSelectedBillboard(billboard);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: MapPin,
      title: "Strategic Locations",
      description: "Premium billboard spots in high-traffic areas across Kwara State",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "AI-powered people counting for accurate traffic data",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "No video storage - only anonymous count data is retained",
    },
    {
      icon: Clock,
      title: "Quick Response",
      description: "Fast processing and approval of billboard requests",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />

      <main className="flex-1">
        <HeroSection />

        <section className="border-b border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="map" className="py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="mb-3 text-3xl font-bold tracking-tight">
                Billboard Locations
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Explore available billboard locations across Kwara State. Click on any
                marker to view details and request the billboard.
              </p>
            </div>

            <BillboardMap
              billboards={billboards}
              onRequestClick={handleRequestClick}
              selectedBillboard={selectedBillboard}
              className="h-[600px]"
            />
          </div>
        </section>

        <section id="billboards" className="border-t border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Available Billboards
                </h2>
                <p className="text-muted-foreground">
                  Browse our collection of premium advertising locations
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span>Available ({billboards.filter(b => b.status === "available").length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                  <span>Occupied ({billboards.filter(b => b.status === "occupied").length})</span>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {billboards.map((billboard) => (
                  <BillboardCard
                    key={billboard.id}
                    billboard={billboard}
                    onRequestClick={handleRequestClick}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="contact" className="py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="mb-3 text-3xl font-bold tracking-tight">
                Request a Billboard
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Interested in advertising on one of our billboards? Fill out the form below
                and our team will contact you within 24-48 hours.
              </p>
            </div>

            <ContactForm
              billboards={billboards}
              selectedBillboard={selectedBillboard}
              onClearSelection={() => setSelectedBillboard(null)}
            />
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
