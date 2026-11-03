import { Link } from "@/lib/legacy-router";
import { Building, ClipboardCheck, Handshake as HandshakeIcon, KeyRound, LandPlot, ChartLine as LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, PublicLayout } from "@/components/site/SiteChrome";

const SERVICES = [
  [Building, "Property sales", "Accurate valuations, premium marketing and skilled negotiation to secure the right buyer."],
  [KeyRound, "Lettings & leasing", "Tenant sourcing, referencing and tenancy agreements for homes and commercial spaces."],
  [HandshakeIcon, "Property management", "Rent collection, maintenance coordination, inspections and owner reporting."],
  [LandPlot, "Land acquisition", "Due diligence, title verification and documentation for land purchases."],
  [LineChart, "Investment advisory", "Market insight to help you build and grow a property portfolio."],
  [ClipboardCheck, "Inspections & valuation", "Professional property inspections and market appraisals."],
] as const;

export function Services() {
  return (
    <PublicLayout>
      <PageHero eyebrow="Services" title="Everything you need, under one roof" description="From finding the right home to managing a growing portfolio." />
      <section className="container-page grid gap-6 py-20 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(([Icon, t, d]) => (
          <div key={t} className="rounded-xl border bg-card p-8 shadow-card transition-shadow hover:shadow-elegant">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-wine-gradient"><Icon className="h-6 w-6 text-gold" /></span>
            <h2 className="mt-5 text-2xl text-burgundy">{t}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>
      <section className="container-page pb-20 text-center">
        <h2 className="text-3xl text-burgundy">Have a property to sell or let?</h2>
        <div className="mt-6 flex justify-center gap-3"><Button asChild size="lg"><Link to="/list-property">List your property</Link></Button><Button asChild size="lg" variant="outline"><Link to="/contact">Contact us</Link></Button></div>
      </section>
    </PublicLayout>
  );
}
