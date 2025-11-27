import { useState } from "react";
import { useLocation } from "wouter";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AdminLogin from "./login";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/billboards": "Billboards",
  "/admin/upload": "Video Upload",
  "/admin/analytics": "Analytics",
  "/admin/requests": "Requests",
  "/admin/settings": "Settings",
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("kwara-admin-auth") === "true";
  });

  const handleLogin = () => {
    localStorage.setItem("kwara-admin-auth", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("kwara-admin-auth");
    setIsAuthenticated(false);
    setLocation("/admin");
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const pageTitle = pageTitles[location] || "Admin";

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar onLogout={handleLogout} />
        <SidebarInset className="flex flex-col">
          <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" data-testid="button-sidebar-toggle" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
