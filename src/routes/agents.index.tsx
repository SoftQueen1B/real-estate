"use client";
import { useQuery } from "@tanstack/react-query";
import { AgentTile } from "@/components/site/Cards";
import { PageHero, PublicLayout } from "@/components/site/SiteChrome";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/site/StateViews";
import { api, toPaginated } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import type { PublicAgent } from "@/lib/types";

export function Agents() {
  const q = useQuery({ queryKey: ["public", "agents", "all"], queryFn: async () => toPaginated<PublicAgent>(await api.get(endpoints.public.agents, { per_page: 50 })).data });
  return (
    <PublicLayout>
      <PageHero eyebrow="Our team" title="Meet our agents" description="Experienced professionals who know the market inside out." />
      <div className="container-page py-14">
        {q.isLoading ? <LoadingGrid count={8} /> : q.isError ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> : q.data?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{q.data.map((a) => <AgentTile key={a.id} agent={a} />)}</div>
        ) : <EmptyState title="Agent profiles are coming soon" />}
      </div>
    </PublicLayout>
  );
}
