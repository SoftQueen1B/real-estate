import { Link } from "@/lib/legacy-router";
import { Menu, Phone, Mail, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { DATA_MODE } from "@/lib/data-mode";

const NAV = [
  { to: "/properties", label: "Properties" },
  { to: "/services", label: "Services" },
  { to: "/agents", label: "Agents" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Journal" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Lena Real Estate home">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-wine-gradient font-display text-lg text-gold ring-1 ring-gold/50">
        L
      </span>
      <span className={`font-display text-xl leading-none ${light ? "text-primary-foreground" : "text-burgundy"}`}>
        Lena <span className="block text-[0.6rem] font-sans uppercase tracking-[0.3em] text-gold">Real Estate</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="hidden bg-burgundy text-xs text-secondary md:block">
        <div className="container-page flex h-9 items-center justify-end gap-6">
          <a href="tel:+2348000000000" className="flex items-center gap-1.5 hover:text-gold">
            <Phone className="h-3.5 w-3.5 text-gold" /> +234 800 000 0000
          </a>
          <a href="mailto:hello@lenarealestate.com" className="flex items-center gap-1.5 hover:text-gold">
            <Mail className="h-3.5 w-3.5 text-gold" /> hello@lenarealestate.com
          </a>
        </div>
      </div>
      <div className="container-page flex h-18 items-center justify-between py-3">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to={user ? "/admin" : "/login"}>{user ? "Dashboard" : "Staff login"}</Link>
          </Button>
          <Button asChild>
            <Link to="/contact">Make an enquiry</Link>
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav className="border-t bg-background lg:hidden" aria-label="Mobile">
          <div className="container-page flex flex-col gap-1 py-4">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 hover:bg-accent">
                {n.label}
              </Link>
            ))}
            <Link to="/list-property" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 hover:bg-accent">
              List your property
            </Link>
            <Button asChild className="mt-2">
              <Link to="/contact" onClick={() => setOpen(false)}>Make an enquiry</Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-burgundy text-secondary">
      <div className="container-page grid gap-10 py-16 md:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="text-sm text-secondary/70">
            Premium homes, land and commercial spaces — bought, sold, let and managed with care.
          </p>
        </div>
        <FooterCol title="Explore" links={[["/properties", "Properties"], ["/list-property", "List a property"], ["/agents", "Our agents"], ["/blog", "Journal"]]} />
        <FooterCol title="Company" links={[["/about", "About us"], ["/services", "Services"], ["/faq", "FAQ"], ["/contact", "Contact"]]} />
        <div className="space-y-3 text-sm">
          <h3 className="eyebrow">Get in touch</h3>
          <p className="text-secondary/80">Port Harcourt, Rivers State, Nigeria</p>
          <a href="tel:+2348000000000" className="block hover:text-gold">+234 800 000 0000</a>
          <a href="mailto:hello@lenarealestate.com" className="block hover:text-gold">hello@lenarealestate.com</a>
          <div className="flex gap-4 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-gold">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-gold">Facebook</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-gold">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="border-t border-secondary/15">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-secondary/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Lena Real Estate. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-gold">Privacy policy</Link>
            <Link to="/terms" className="hover:text-gold">Terms & conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="space-y-3 text-sm">
      <h3 className="eyebrow">{title}</h3>
      {links.map(([to, label]) => (
        <Link key={to} to={to} className="block text-secondary/80 hover:text-gold">
          {label}
        </Link>
      ))}
    </div>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      {DATA_MODE === "mock" && <div role="status" className="border-b bg-secondary px-4 py-2 text-center text-xs text-secondary-foreground">Sample content · Properties, prices and profiles are illustrative.</div>}
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string | undefined }) {
  return (
    <section className="bg-wine-gradient text-primary-foreground">
      <div className="container-page py-16 md:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl md:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-primary-foreground/80">{description}</p>}
      </div>
    </section>
  );
}
