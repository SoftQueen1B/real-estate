"use client";
import { Link, useNavigate } from "@/lib/legacy-router";
import { useQuery } from "@tanstack/react-query";
import { Award, Building, Handshake as HandshakeIcon, KeyRound, Quote, Search, ShieldCheck, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/site/SiteChrome";
import { PropertyCard } from "@/components/site/PropertyCard";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/site/StateViews";
import { api, toPaginated, type QueryValue } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { humanize } from "@/lib/format";
import { AgentTile, BlogCard } from "@/components/site/Cards";
import { PROPERTY_TYPES } from "@/lib/resources";
import type { BlogPost, PublicAgent, PublicProperty, Testimonial } from "@/lib/types";

function usePublicList<T>(key: string, path: string, query?: Record<string, QueryValue>) {
  return useQuery({
    queryKey: ["public", key, query],
    queryFn: async ({ signal }) => toPaginated<T>(await api.get(path, query, signal)).data,
    retry: 1,
  });
}

function PropertyRow({ title, eyebrow, query, link }: { title: string; eyebrow: string; query: Record<string, QueryValue>; link: Record<string, string> }) {
  const q = usePublicList<PublicProperty>("properties", endpoints.public.properties, { ...query, per_page: 3 });
  return (
    <Section eyebrow={eyebrow} title={title} action={<Link to="/properties" search={link} className="text-sm font-medium text-primary hover:underline">View all →</Link>}>
      {q.isLoading ? <LoadingGrid count={3} /> : q.isError ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> : q.data?.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{q.data.map((p) => <PropertyCard key={p.id} property={p} />)}</div>
      ) : <EmptyState title="No properties here yet" description="New listings are added regularly — check back soon." />}
    </Section>
  );
}

function Section({ eyebrow, title, action, children, tone }: { eyebrow: string; title: string; action?: ReactNode; children: ReactNode; tone?: "beige" }) {
  return (
    <section className={tone === "beige" ? "bg-secondary" : ""}>
      <div className="container-page py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div><p className="eyebrow">{eyebrow}</p><h2 className="mt-2 text-3xl text-burgundy md:text-4xl">{title}</h2></div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}

function HeroSearch() {
  const navigate = useNavigate();
  const [f, setF] = useState({ city: "", property_type: "", purpose: "", max_price: "" });
  const cls = "h-11 w-full rounded-md border border-input bg-background px-3 text-sm";
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); navigate({ to: "/properties", search: Object.fromEntries(Object.entries(f).filter(([, v]) => v)) }); }}
      className="mt-10 grid gap-3 rounded-xl bg-card p-4 shadow-elegant sm:grid-cols-2 lg:grid-cols-5"
      aria-label="Property search"
    >
      <input aria-label="Location" placeholder="Location (city)" className={cls} value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} />
      <select aria-label="Property type" className={cls} value={f.property_type} onChange={(e) => setF({ ...f, property_type: e.target.value })}>
        <option value="">Any type</option>{PROPERTY_TYPES.map((t) => <option key={t} value={t}>{humanize(t)}</option>)}
      </select>
      <select aria-label="Purpose" className={cls} value={f.purpose} onChange={(e) => setF({ ...f, purpose: e.target.value })}>
        <option value="">Buy or rent</option><option value="sale">Buy</option><option value="rent">Rent</option><option value="lease">Lease</option>
      </select>
      <input aria-label="Maximum budget" inputMode="numeric" placeholder="Max budget (₦)" className={cls} value={f.max_price} onChange={(e) => setF({ ...f, max_price: e.target.value.replace(/\D/g, "") })} />
      <Button type="submit" size="lg" className="h-11"><Search /> Search</Button>
    </form>
  );
}

export function Home() {
  const featured = usePublicList<PublicProperty>("featured", endpoints.public.featured, { per_page: 6 });
  const agents = usePublicList<PublicAgent>("agents", endpoints.public.agents, { per_page: 4 });
  const testimonials = usePublicList<Testimonial>("testimonials", endpoints.public.testimonials);
  const posts = usePublicList<BlogPost>("blog", endpoints.public.blog, { per_page: 3 });

  return (
    <PublicLayout>
      <section className="relative overflow-hidden">
        <Image
          src="/asset/hero.jpg"
          alt="Luxury villa with infinity pool at sunset"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="container-page relative py-24 md:py-36">
          <div className="max-w-2xl animate-rise text-primary-foreground">
            <p className="eyebrow">Lena Real Estate</p>
            <h1 className="mt-4 text-5xl leading-tight md:text-6xl">Find a home worthy of your story.</h1>
            <p className="mt-5 text-lg text-primary-foreground/85">Curated homes, land and commercial spaces — bought, sold, let and managed with discretion and care.</p>
          </div>
          <HeroSearch />
        </div>
      </section>

      <Section eyebrow="Handpicked" title="Featured properties">
        {featured.isLoading ? <LoadingGrid /> : featured.isError ? <ErrorState error={featured.error} onRetry={() => featured.refetch()} /> : featured.data?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{featured.data.map((p) => <PropertyCard key={p.id} property={p} />)}</div>
        ) : <EmptyState title="No featured properties right now" action={<Button asChild><Link to="/properties">Browse all properties</Link></Button>} />}
      </Section>

      <PropertyRow eyebrow="Just listed" title="Latest properties" query={{ sort: "newest" }} link={{ sort: "newest" }} />

      <section className="bg-secondary">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">About us</p>
            <h2 className="mt-2 text-4xl text-burgundy">Real estate, handled with integrity.</h2>
            <p className="mt-5 text-muted-foreground">Lena Real Estate helps families, investors and businesses buy, sell, rent and manage property with confidence. Every listing is verified, every client is heard, and every transaction is handled transparently.</p>
            <Button asChild className="mt-8"><Link to="/about">Our story</Link></Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [Building, "Sales", "Market-led pricing and expert negotiation."],
              [KeyRound, "Lettings", "Vetted tenants and clear tenancy terms."],
              [HandshakeIcon, "Property management", "Rent collection, upkeep and reporting."],
              [Sparkles, "Advisory", "Investment and land acquisition guidance."],
            ].map(([Icon, t, d]: any) => (
              <div key={t} className="rounded-xl border bg-card p-6"><Icon className="h-7 w-7 text-gold" /><h3 className="mt-4 text-lg">{t}</h3><p className="mt-1 text-sm text-muted-foreground">{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <PropertyRow eyebrow="Own it" title="Properties for sale" query={{ purpose: "sale" }} link={{ purpose: "sale" }} />
      <PropertyRow eyebrow="Move in" title="Properties for rent" query={{ purpose: "rent" }} link={{ purpose: "rent" }} />
      <PropertyRow eyebrow="Build your vision" title="Land" query={{ property_type: "land" }} link={{ property_type: "land" }} />

      <section className="bg-wine-gradient text-primary-foreground">
        <div className="container-page py-20">
          <p className="eyebrow">Why Lena</p>
          <h2 className="mt-2 text-4xl">Why clients choose us</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[[ShieldCheck, "Verified listings", "Titles and documents are checked before a property is published."], [Award, "Experienced agents", "Local experts who know every street and every price trend."], [HandshakeIcon, "Transparent process", "Clear fees, written agreements and honest advice."]].map(([Icon, t, d]: any) => (
              <div key={t} className="border-l border-gold/50 pl-6"><Icon className="h-7 w-7 text-gold" /><h3 className="mt-3 text-xl">{t}</h3><p className="mt-2 text-sm text-primary-foreground/75">{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <Section eyebrow="Our people" title="Meet the team" action={<Link to="/agents" className="text-sm font-medium text-primary hover:underline">All agents →</Link>}>
        {agents.isLoading ? <LoadingGrid count={4} /> : agents.isError ? <ErrorState error={agents.error} onRetry={() => agents.refetch()} /> : agents.data?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{agents.data.map((a) => <AgentTile key={a.id} agent={a} />)}</div>
        ) : <EmptyState title="Our team profiles are coming soon" />}
      </Section>

      <Section eyebrow="Testimonials" title="What our clients say" tone="beige">
        {testimonials.isLoading ? <LoadingGrid count={3} /> : testimonials.isError ? <ErrorState error={testimonials.error} onRetry={() => testimonials.refetch()} /> : testimonials.data?.length ? (
          <div className="grid gap-6 md:grid-cols-3">{testimonials.data.slice(0, 3).map((t) => (
            <figure key={t.id} className="rounded-xl bg-card p-7 shadow-card"><Quote className="h-7 w-7 text-gold" /><blockquote className="mt-4 text-sm leading-relaxed">{t.content}</blockquote><figcaption className="mt-5 font-display text-lg text-burgundy">{t.name}{t.role && <span className="block font-sans text-xs text-muted-foreground">{t.role}</span>}</figcaption></figure>
          ))}</div>
        ) : <EmptyState title="No testimonials yet" />}
      </Section>

      <Section eyebrow="Journal" title="Latest articles" action={<Link to="/blog" className="text-sm font-medium text-primary hover:underline">All articles →</Link>}>
        {posts.isLoading ? <LoadingGrid count={3} /> : posts.isError ? <ErrorState error={posts.error} onRetry={() => posts.refetch()} /> : posts.data?.length ? (
          <div className="grid gap-6 md:grid-cols-3">{posts.data.map((p) => <BlogCard key={p.id} post={p} />)}</div>
        ) : <EmptyState title="No articles yet" />}
      </Section>

      <section className="container-page pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-burgundy p-10 text-primary-foreground md:flex-row md:items-center md:p-14">
          <div><h2 className="text-3xl md:text-4xl">Ready to make a move?</h2><p className="mt-2 text-primary-foreground/75">Speak with an advisor or list your property with us today.</p></div>
          <div className="flex gap-3"><Button variant="gold" size="lg" asChild><Link to="/contact">Contact us</Link></Button><Button variant="heroOutline" size="lg" asChild><Link to="/list-property">List a property</Link></Button></div>
        </div>
      </section>
    </PublicLayout>
  );
}

