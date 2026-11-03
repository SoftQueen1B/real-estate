"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHero, PublicLayout } from "@/components/site/SiteChrome";
import { PropertyCard } from "@/components/site/PropertyCard";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/site/StateViews";
import { api, toPaginated } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { humanize } from "@/lib/format";
import { PROPERTY_TYPES } from "@/lib/resources";
import type { PublicProperty } from "@/lib/types";
import { useNavigate } from "@/lib/legacy-router";

const FILTER_KEYS = ["q", "purpose", "property_type", "state", "city", "min_price", "max_price", "bedrooms", "bathrooms", "sort", "page"] as const;
type Filters = { [K in (typeof FILTER_KEYS)[number]]?: string | undefined };

function parseSearch(sp: URLSearchParams): Filters {
  const out: Filters = {};
  FILTER_KEYS.forEach((k) => {
    const v = sp.get(k);
    if (v !== undefined && v !== null && v !== "") out[k] = v;
  });
  return out;
}

const fieldCls = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";

export function PropertiesPage() {
  const searchParams = useSearchParams();
  const search = parseSearch(searchParams);
  const navigate = useNavigate();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [draft, setDraft] = useState<Filters>(search);
  const page = Number(search.page ?? 1);

  const q = useQuery({
    queryKey: ["public", "properties", search],
    queryFn: async ({ signal }) => toPaginated<PublicProperty>(await api.get(endpoints.public.properties, { ...search, per_page: 12 }, signal)),
    placeholderData: keepPreviousData,
  });

  const apply = (next: Filters) => navigate({ to: "/properties", search: Object.fromEntries(Object.entries(next).filter(([, v]) => v)) as Record<string, string> });
  const set = (k: keyof Filters, v: string) => setDraft((d) => ({ ...d, [k]: v }));
  const hasFilters = Object.keys(search).some((k) => k !== "page" && k !== "sort");

  return (
    <PublicLayout>
      <PageHero eyebrow="Properties" title="Find your next property" description="Filter by location, type, budget and more. Share the link to save your search." />
      <div className="container-page py-10">
        <form onSubmit={(e) => { e.preventDefault(); apply({ ...draft, page: undefined }); }} className="rounded-xl border bg-card p-4 shadow-card">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
            <Input aria-label="Keyword" placeholder="Keyword, e.g. duplex with pool" value={draft.q ?? ""} onChange={(e) => set("q", e.target.value)} className="h-10" />
            <Input aria-label="City" placeholder="City" value={draft.city ?? ""} onChange={(e) => set("city", e.target.value)} className="h-10" />
            <Button type="button" variant="outline" className="h-10" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal /> Filters</Button>
            <Button type="submit" className="h-10">Search</Button>
          </div>
          {showFilters && (
            <div className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4">
              <select aria-label="Purpose" className={fieldCls} value={draft.purpose ?? ""} onChange={(e) => set("purpose", e.target.value)}>
                <option value="">Any purpose</option><option value="sale">For sale</option><option value="rent">For rent</option><option value="lease">For lease</option>
              </select>
              <select aria-label="Property type" className={fieldCls} value={draft.property_type ?? ""} onChange={(e) => set("property_type", e.target.value)}>
                <option value="">Any type</option>{PROPERTY_TYPES.map((t) => <option key={t} value={t}>{humanize(t)}</option>)}
              </select>
              <Input aria-label="State" placeholder="State" value={draft.state ?? ""} onChange={(e) => set("state", e.target.value)} className="h-10" />
              <div className="grid grid-cols-2 gap-2">
                <Input aria-label="Bedrooms" placeholder="Beds" inputMode="numeric" value={draft.bedrooms ?? ""} onChange={(e) => set("bedrooms", e.target.value.replace(/\D/g, ""))} className="h-10" />
                <Input aria-label="Bathrooms" placeholder="Baths" inputMode="numeric" value={draft.bathrooms ?? ""} onChange={(e) => set("bathrooms", e.target.value.replace(/\D/g, ""))} className="h-10" />
              </div>
              <Input aria-label="Minimum price" placeholder="Min price (₦)" inputMode="numeric" value={draft.min_price ?? ""} onChange={(e) => set("min_price", e.target.value.replace(/\D/g, ""))} className="h-10" />
              <Input aria-label="Maximum price" placeholder="Max price (₦)" inputMode="numeric" value={draft.max_price ?? ""} onChange={(e) => set("max_price", e.target.value.replace(/\D/g, ""))} className="h-10" />
            </div>
          )}
        </form>

        <div className="my-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">{q.data ? `${q.data.meta.total} properties` : " "}</p>
          <div className="flex items-center gap-2">
            {hasFilters && <Button variant="ghost" size="sm" onClick={() => { setDraft({}); apply({}); }}><X /> Clear filters</Button>}
            <select aria-label="Sort" className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={search.sort ?? "newest"} onChange={(e) => apply({ ...search, sort: e.target.value, page: undefined })}>
              <option value="newest">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option>
            </select>
            <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" aria-label="Grid view" onClick={() => setView("grid")}><LayoutGrid /></Button>
            <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" aria-label="List view" onClick={() => setView("list")}><List /></Button>
          </div>
        </div>

        {q.isLoading ? <LoadingGrid /> : q.isError ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> : !q.data?.data.length ? (
          <EmptyState title="No properties match your search" description="Try widening your budget or removing a filter." action={hasFilters ? <Button onClick={() => { setDraft({}); apply({}); }}>Clear filters</Button> : undefined} />
        ) : (
          <div className={view === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-6 md:grid-cols-2"}>
            {q.data.data.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}

        {q.data && q.data.meta.last_page > 1 && (
          <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-3">
            <Button variant="outline" disabled={page <= 1} onClick={() => apply({ ...search, page: String(page - 1) })}><ChevronLeft /> Previous</Button>
            <span className="text-sm text-muted-foreground">Page {page} of {q.data.meta.last_page}</span>
            <Button variant="outline" disabled={page >= q.data.meta.last_page} onClick={() => apply({ ...search, page: String(page + 1) })}>Next <ChevronRight /></Button>
          </nav>
        )}
      </div>
    </PublicLayout>
  );
}
