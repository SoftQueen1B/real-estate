"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { Link } from "@/lib/legacy-router";
import { PublicLayout } from "@/components/site/SiteChrome";
import { PropertyCard } from "@/components/site/PropertyCard";
import { EmptyState, ErrorState, Spinner } from "@/components/site/StateViews";
import { api, toPaginated, unwrap } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import type { PublicAgent, PublicProperty } from "@/lib/types";

export function AgentProfile() {
  const { id } = useParams<{ id: string }>();
  const q = useQuery({ queryKey: ["public", "agent", id], queryFn: async () => unwrap(await api.get<PublicAgent | { data: PublicAgent }>(endpoints.public.agent(id))) });
  const listings = useQuery({ queryKey: ["public", "properties", { agent_id: id }], queryFn: async () => toPaginated<PublicProperty>(await api.get(endpoints.public.properties, { agent_id: id, per_page: 6 })).data });

  return (
    <PublicLayout>
      <div className="container-page py-14">
        <Link to="/agents" className="text-sm text-muted-foreground hover:text-primary">← All agents</Link>
        {q.isLoading ? <Spinner /> : q.isError || !q.data ? <div className="mt-6"><ErrorState error={q.error} onRetry={() => q.refetch()} /></div> : (
          <>
            <div className="mt-6 grid gap-10 md:grid-cols-[280px_1fr]">
              <div className="aspect-square overflow-hidden rounded-2xl bg-muted shadow-elegant">{q.data.profile_image ? <img src={q.data.profile_image} alt={`${q.data.first_name} ${q.data.last_name}`} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center font-display text-7xl text-primary/40">{q.data.first_name[0]}{q.data.last_name[0]}</div>}</div>
              <div>
                <p className="eyebrow">{q.data.specialization ?? "Real estate agent"}</p>
                <h1 className="mt-2 text-4xl text-burgundy md:text-5xl">{q.data.first_name} {q.data.last_name}</h1>
                {q.data.bio && <p className="mt-5 whitespace-pre-line leading-relaxed text-muted-foreground">{q.data.bio}</p>}
                <div className="mt-6 flex flex-wrap gap-5 text-sm">
                  {q.data.phone && <a href={`tel:${q.data.phone}`} className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4 text-gold" />{q.data.phone}</a>}
                  {q.data.email && <a href={`mailto:${q.data.email}`} className="flex items-center gap-2 hover:text-primary"><Mail className="h-4 w-4 text-gold" />{q.data.email}</a>}
                </div>
              </div>
            </div>
            <h2 className="mb-6 mt-16 text-3xl text-burgundy">Current listings</h2>
            {listings.isLoading ? <Spinner /> : listings.isError ? <ErrorState error={listings.error} /> : listings.data?.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{listings.data.map((p) => <PropertyCard key={p.id} property={p} />)}</div>
            ) : <EmptyState title="No active listings right now" />}
          </>
        )}
      </div>
    </PublicLayout>
  );
}
