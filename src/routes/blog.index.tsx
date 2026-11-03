"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/site/Cards";
import { PageHero, PublicLayout } from "@/components/site/SiteChrome";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/site/StateViews";
import { api, toPaginated } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import type { BlogPost } from "@/lib/types";

export function Blog() {
  const [page, setPage] = useState(1);
  const q = useQuery({ queryKey: ["public", "blog", page], queryFn: async () => toPaginated<BlogPost>(await api.get(endpoints.public.blog, { page, per_page: 9 })) });
  return (
    <PublicLayout>
      <PageHero eyebrow="Journal" title="Insights & guides" description="Market news and practical advice for buyers, tenants and owners." />
      <div className="container-page py-14">
        {q.isLoading ? <LoadingGrid /> : q.isError ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> : q.data?.data.length ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{q.data.data.map((p) => <BlogCard key={p.id} post={p} />)}</div>
            {q.data.meta.last_page > 1 && (
              <div className="mt-10 flex justify-center gap-3">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button variant="outline" disabled={page >= q.data.meta.last_page} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </>
        ) : <EmptyState title="No articles yet" />}
      </div>
    </PublicLayout>
  );
}
