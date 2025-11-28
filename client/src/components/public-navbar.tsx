import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";

export function PublicNavbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", isAnchor: false },
    { href: "billboards", label: "Billboards", isAnchor: true },
    { href: "map", label: "Map", isAnchor: true },
    { href: "contact", label: "Contact", isAnchor: true },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.isAnchor) {
      document.getElementById(link.href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/kwara-logo.jpeg" 
            alt="Kwara State Government Logo" 
            className="h-10 w-10 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground">KWARA</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Billboard Analytics
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            link.isAnchor ? (
              <Button
                key={link.href}
                variant="ghost"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
                onClick={() => handleNavClick(link)}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Button>
            ) : (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`text-sm font-medium ${
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Button>
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/admin">
            <Button variant="outline" size="sm" className="hidden sm:flex" data-testid="button-admin-login">
              Admin Portal
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              link.isAnchor ? (
                <Button
                  key={link.href}
                  variant="ghost"
                  className="w-full justify-start text-sm font-medium"
                  onClick={() => {
                    handleNavClick(link);
                    setMobileMenuOpen(false);
                  }}
                  data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Button>
              ) : (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              )
            ))
            <Link href="/admin">
              <Button
                variant="outline"
                className="mt-2 w-full"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="mobile-button-admin-login"
              >
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
