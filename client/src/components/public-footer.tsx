import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "wouter";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <MapPin className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight">KWARA</span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Billboard Analytics
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Kwara State Signage and Advertising Agency. Providing premium billboard
              locations with real-time traffic analytics.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#billboards" className="text-muted-foreground transition-colors hover:text-foreground">
                  Available Billboards
                </Link>
              </li>
              <li>
                <Link href="/#map" className="text-muted-foreground transition-colors hover:text-foreground">
                  Location Map
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-muted-foreground transition-colors hover:text-foreground">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span>Government House, Ilorin, Kwara State</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>+234 (0) 803 XXX XXXX</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>signage@kwarastate.gov.ng</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Stay updated with the latest billboard opportunities.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground md:flex-row md:text-left">
            <p>
              &copy; {new Date().getFullYear()} Kwara State Signage and Advertising Agency. All rights reserved.
            </p>
            <p className="text-xs">
              Powered by Kwara State Government
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
