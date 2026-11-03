import { useQuery } from "@tanstack/react-query";
import { PageHero, PublicLayout } from "@/components/site/SiteChrome";
import { EmptyState, ErrorState, Spinner } from "@/components/site/StateViews";
import { api, unwrap } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { formatDate } from "@/lib/format";

interface CmsPageData { title: string; content: string; updated_at?: string }

/** Renders a CMS-managed page (e.g. legal pages) fetched by slug. */
export function CmsPage({ slug, eyebrow, fallbackTitle }: { slug: string; eyebrow: string; fallbackTitle: string }) {
  const q = useQuery({
    queryKey: ["public", "page", slug],
    queryFn: async () => unwrap(await api.get<CmsPageData | { data: CmsPageData }>(endpoints.public.page(slug))),
  });
  return (
    <PublicLayout>
      <PageHero eyebrow={eyebrow} title={q.data?.title ?? fallbackTitle} description={q.data?.updated_at ? `Last updated ${formatDate(q.data.updated_at)}` : undefined} />
      <div className="container-page max-w-3xl py-14">
        {q.isLoading ? <Spinner /> : q.isError ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> : q.data?.content ? (
          <article className="space-y-4 whitespace-pre-line leading-relaxed text-foreground/85">{q.data.content}</article>
        ) : <EmptyState title="This page is being prepared" />}
      </div>
    </PublicLayout>
  );
}
