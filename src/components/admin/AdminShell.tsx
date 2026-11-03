"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartBar as BarChart3, Bell, Building2, CalendarDays, ClipboardList, CircleDollarSign, FileText, Hop as Home, LayoutDashboard, LifeBuoy, LogOut, Menu, MessageSquare, Search, Settings, Shield, Users, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth, canAccess } from "@/lib/auth";
import { DATA_MODE } from "@/lib/data-mode";

const ADMIN_NAV = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, area: "" },
  { label: "Properties", href: "/admin/properties", icon: Building2, area: "properties" },
  { label: "Listings", href: "/admin/listings", icon: ClipboardList, area: "listings" },
  { label: "Owners", href: "/admin/owners", icon: Users, area: "owners" },
  { label: "Clients", href: "/admin/clients", icon: Users, area: "clients" },
  { label: "Agents", href: "/admin/agents", icon: Shield, area: "agents" },
  { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare, area: "enquiries" },
  { label: "Inspections", href: "/admin/inspections", icon: CalendarDays, area: "inspections" },
  { label: "Transactions", href: "/admin/transactions", icon: CircleDollarSign, area: "transactions" },
  { label: "Tenancies", href: "/admin/tenancies", icon: Home, area: "tenancies" },
  { label: "Payments", href: "/admin/payments", icon: CircleDollarSign, area: "payments" },
  { label: "Expenses", href: "/admin/expenses", icon: BarChart3, area: "expenses" },
  { label: "Maintenance", href: "/admin/maintenance", icon: LifeBuoy, area: "maintenance" },
  { label: "Reports", href: "/admin/reports", icon: BarChart3, area: "reports" },
  { label: "Blog posts", href: "/admin/content/blog", icon: FileText, area: "content" },
  { label: "Pages", href: "/admin/content/pages", icon: FileText, area: "content" },
  { label: "FAQs", href: "/admin/content/faqs", icon: FileText, area: "content" },
  { label: "Users", href: "/admin/users", icon: Users, area: "users" },
  { label: "Settings", href: "/admin/settings", icon: Settings, area: "settings" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-secondary px-4 text-center">
        <h1 className="text-2xl text-burgundy">Sign in required</h1>
        <p className="text-sm text-muted-foreground">You need to sign in to access the dashboard.</p>
        <Link href="/login" className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
          Go to sign in
        </Link>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const visibleNav = ADMIN_NAV.filter((item) => item.area === "" || canAccess(user, item.area));

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 p-6">
        <span className="grid size-9 place-items-center rounded-md bg-wine-gradient font-display text-lg text-gold ring-1 ring-gold/50">
          L
        </span>
        {sidebarOpen && (
          <span className="font-display text-lg text-primary-foreground">
            Lena
            <small className="block font-sans text-[0.6rem] uppercase tracking-widest text-gold">Operations</small>
          </span>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {visibleNav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium capitalize transition-colors ${
                active
                  ? "bg-white/10 text-gold"
                  : "text-primary-foreground/60 hover:bg-white/5 hover:text-primary-foreground"
              } ${!sidebarOpen ? "lg:justify-center" : ""}`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className="size-4 shrink-0" />
              {sidebarOpen && item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        {sidebarOpen && (
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-gold text-xs font-bold text-burgundy">
              {initials}
            </span>
            <div>
              <p className="text-xs font-medium text-primary-foreground">{user.name}</p>
              <p className="text-[10px] capitalize text-primary-foreground/45">{user.role.replace(/_/g, " ")}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => void logout()}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-xs text-primary-foreground/60 hover:text-primary-foreground"
        >
          <LogOut className="size-4" />
          {sidebarOpen && "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary text-foreground">
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden bg-sidebar text-primary-foreground transition-all lg:block ${
          sidebarOpen ? "w-64" : "w-[76px]"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-sidebar text-primary-foreground">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 rounded-md p-1.5 text-primary-foreground/60"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className={`transition-all ${sidebarOpen ? "lg:pl-64" : "lg:pl-[76px]"}`}>
        <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b bg-background/95 px-5 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-2 text-primary lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden rounded-md p-2 text-primary lg:block"
              aria-label="Toggle sidebar"
            >
              <Menu className="size-5" />
            </button>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button aria-label="Search" className="text-muted-foreground hover:text-foreground">
              <Search className="size-4" />
            </button>
            <button aria-label="Notifications" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="size-4" />
              <span className="absolute -right-1 -top-1 size-1.5 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-2 border-l border-border pl-4">
              <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-bold text-primary">
                {initials}
              </span>
              <span className="hidden text-xs font-semibold text-foreground sm:block">{user.name}</span>
            </div>
          </div>
        </header>
        <section className="mx-auto max-w-[1600px] p-5 lg:p-8">
          {DATA_MODE === "mock" && (
            <div className="mb-6 rounded-md border border-gold/30 bg-gold/5 px-4 py-2 text-xs text-gold-foreground">
              Sample dashboard · Data is illustrative and changes are in-memory only.
            </div>
          )}
          {children}
        </section>
      </div>
    </div>
  );
}

export function AdminHeader({
  title,
  eyebrow,
  description,
  action,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-2 eyebrow">{eyebrow}</p>}
        <h1 className="font-display text-4xl text-burgundy">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
