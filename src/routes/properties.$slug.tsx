"use client";
import { useQuery } from "@tanstack/react-query";
import { Bath, BedDouble, Car, Check, Mail, MapPin, Maximize, Phone, Ruler, Toilet } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PublicLayout } from "@/components/site/SiteChrome";
import { PropertyCard, coverOf } from "@/components/site/PropertyCard";
import { PublicForm } from "@/components/site/PublicForm";
import { ErrorState, Spinner } from "@/components/site/StateViews";
import { api, toPaginated, unwrap } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import { endpoints } from "@/lib/endpoints";
import { formatDate, formatMoney, humanize, PRICE_PERIOD_LABEL } from "@/lib/format";
import type { FieldDef } from "@/lib/resources";
import type { PublicProperty } from "@/lib/types";
import { Link } from "@/lib/legacy-router";

const enquiryFields: FieldDef[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "preferred_contact_method", label: "Contact preference", type: "select", options: ["email", "phone", "whatsapp"] },
  { name: "subject", label: "Subject", type: "text", required: true, span: 2 },
  { name: "message", label: "Message", type: "textarea", required: true, span: 2 },
];
const inspectionFields: FieldDef[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "requested_date", label: "Preferred date", type: "date", required: true },
  { name: "requested_time", label: "Preferred time", type: "time", required: true },
  { name: "message", label: "Message", type: "textarea", span: 2 },
];

export function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [active, setActive] = useState(0);
  const q = useQuery({
    queryKey: ["public", "property", slug],
    queryFn: async () => unwrap(await api.get<PublicProperty | { data: PublicProperty }>(endpoints.public.property(slug))),
    retry: (n, e) => !(e instanceof ApiError && e.status === 404) && n < 1,
  });
  const related = useQuery({
    queryKey: ["public", "related", slug],
    enabled: q.isSuccess,
    queryFn: async () => toPaginated<PublicProperty>(await api.get(endpoints.public.relatedProperties(slug))).data,
  });

  if (q.isLoading) return <PublicLayout><Spinner label="Loading property" /></PublicLayout>;
  if (q.isError || !q.data)
    return (
      <PublicLayout>
        <div className="container-page py-20">
          {q.error instanceof ApiError && q.error.status === 404 ? (
            <div className="text-center"><h1 className="text-4xl text-burgundy">Property not available</h1><p className="mt-3 text-muted-foreground">It may have been sold, let or unpublished.</p><Link to="/properties" className="mt-6 inline-block text-primary underline">Browse other properties</Link></div>
          ) : <ErrorState error={q.error} onRetry={() => q.refetch()} />}
        </div>
      </PublicLayout>
    );

  const p = q.data;
  const l = p.listing;
  const images = p.images?.length ? [...p.images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) : coverOf(p) ? [{ id: 0, url: coverOf(p)! }] : [];
  const specs = [
    [BedDouble, "Bedrooms", p.bedrooms], [Bath, "Bathrooms", p.bathrooms], [Toilet, "Toilets", p.toilets],
    [Car, "Parking", p.parking_spaces], [Ruler, "Land size", p.land_size && `${p.land_size} ${p.size_unit ?? ""}`], [Maximize, "Floor area", p.floor_area && `${p.floor_area} ${p.size_unit ?? ""}`],
  ].filter(([, , v]) => v !== null && v !== undefined && v !== "") as [any, string, any][];

  const jsonLd = {
    "@context": "https://schema.org", "@type": "RealEstateListing", name: p.title, description: p.description ?? undefined,
    image: images.map((i) => i.url), address: { "@type": "PostalAddress", streetAddress: p.address_line, addressLocality: p.city, addressRegion: p.state },
    offers: l ? { "@type": "Offer", price: l.price, priceCurrency: l.currency } : undefined,
  };

  return (
    <PublicLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-page py-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground"><Link to="/properties" className="hover:text-primary">Properties</Link> / <span className="text-foreground">{p.title}</span></nav>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex gap-2">
              {l && <span className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">For {l.listing_purpose}</span>}
              <span className="rounded-full bg-secondary px-3 py-1 text-xs">{humanize(p.property_type)}</span>
              {l && <span className="rounded-full border border-gold px-3 py-1 text-xs">{humanize(l.status)}</span>}
            </div>
            <h1 className="mt-3 text-4xl text-burgundy md:text-5xl">{p.title}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-4 w-4 text-gold" />{[p.address_line, p.city, p.state].filter(Boolean).join(", ")}</p>
          </div>
          {l && <p className="font-display text-4xl text-primary">{formatMoney(l.price, l.currency)}<span className="text-base text-muted-foreground"> {PRICE_PERIOD_LABEL[l.price_period ?? ""] ?? ""}</span></p>}
        </div>

        {images.length > 0 && (
          <div className="mt-8 space-y-3">
            <div className="aspect-[16/9] overflow-hidden rounded-xl bg-muted"><img src={images[active]?.url} alt={images[active]?.alt_text ?? p.title} className="h-full w-full object-cover" /></div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={img.id} onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`} className={`h-20 w-28 shrink-0 overflow-hidden rounded-md ring-2 ${i === active ? "ring-gold" : "ring-transparent"}`}>
                    <img src={img.url} alt={img.alt_text ?? `${p.title} photo ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-10">
            {specs.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {specs.map(([Icon, label, v]) => <div key={label} className="rounded-lg border bg-card p-4"><Icon className="h-5 w-5 text-gold" /><p className="mt-2 text-xs text-muted-foreground">{label}</p><p className="font-semibold">{v}</p></div>)}
              </div>
            )}
            {p.description && <section><h2 className="text-2xl text-burgundy">Description</h2><p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{p.description}</p></section>}
            {!!p.amenities?.length && (
              <section><h2 className="text-2xl text-burgundy">Amenities & features</h2><ul className="mt-4 grid gap-2 sm:grid-cols-2">{p.amenities.map((a) => <li key={a.id} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-gold" />{a.name}</li>)}</ul></section>
            )}
            {l?.available_from && <p className="text-sm text-muted-foreground">Available from <strong className="text-foreground">{formatDate(l.available_from)}</strong></p>}
          </div>

          <aside className="space-y-6">
            {l?.agent && (
              <div className="rounded-xl border bg-card p-6 shadow-card">
                <p className="eyebrow">Your agent</p>
                <Link to="/agents/$id" params={{ id: String(l.agent.id) }} className="mt-2 block font-display text-xl hover:text-primary">{l.agent.first_name} {l.agent.last_name}</Link>
                <div className="mt-3 space-y-1.5 text-sm">
                  {l.agent.phone && <a href={`tel:${l.agent.phone}`} className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4 text-gold" />{l.agent.phone}</a>}
                  {l.agent.email && <a href={`mailto:${l.agent.email}`} className="flex items-center gap-2 hover:text-primary"><Mail className="h-4 w-4 text-gold" />{l.agent.email}</a>}
                </div>
              </div>
            )}
            {l ? (
              <div className="rounded-xl border bg-card p-6 shadow-card">
                <Tabs defaultValue="inspection">
                  <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="inspection">Book inspection</TabsTrigger><TabsTrigger value="enquiry">Enquire</TabsTrigger></TabsList>
                  <TabsContent value="inspection" className="pt-4">
                    <PublicForm fields={inspectionFields} endpoint={endpoints.public.inspections} extra={{ listing_id: l.id }} submitLabel="Request inspection" successTitle="Inspection requested" successText="Your request is pending. We'll contact you to confirm a time." />
                  </TabsContent>
                  <TabsContent value="enquiry" className="pt-4">
                    <PublicForm fields={enquiryFields} endpoint={endpoints.public.enquiries} extra={{ listing_id: l.id }} submitLabel="Send enquiry" successTitle="Enquiry sent" successText="Thank you — an agent will be in touch shortly." />
                  </TabsContent>
                </Tabs>
              </div>
            ) : <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">This property isn't currently listed. <Link to="/contact" className="text-primary underline">Contact us</Link> for details.</p>}
          </aside>
        </div>

        {!!related.data?.length && (
          <section className="mt-16"><h2 className="mb-6 text-3xl text-burgundy">Related properties</h2><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.data.slice(0, 3).map((r) => <PropertyCard key={r.id} property={r} />)}</div></section>
        )}
      </div>
    </PublicLayout>
  );
}
