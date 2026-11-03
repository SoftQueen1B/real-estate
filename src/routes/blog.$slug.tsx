"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Link } from "@/lib/legacy-router";
import { PublicLayout } from "@/components/site/SiteChrome";
import { ErrorState, Spinner } from "@/components/site/StateViews";
import { api, unwrap } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { formatDate, humanize } from "@/lib/format";
import type { BlogPost } from "@/lib/types";

export function Article() {
  const { slug } = useParams<{ slug: string }>();
  const q = useQuery({ queryKey: ["public", "post", slug], queryFn: async () => unwrap(await api.get<BlogPost | { data: BlogPost }>(endpoints.public.blogPost(slug))) });
  return (
    <PublicLayout>
      <article className="container-page max-w-3xl py-14">
        <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary">← Journal</Link>
        {q.isLoading ? <Spinner /> : q.isError || !q.data ? <div className="mt-6"><ErrorState error={q.error} onRetry={() => q.refetch()} /></div> : (
          <>
            <p className="eyebrow mt-6">{q.data.category ?? "Insights"} · {formatDate(q.data.published_at)}</p>
            <h1 className="mt-3 text-4xl text-burgundy md:text-5xl">{q.data.title}</h1>
            {q.data.featured_image && <img src={q.data.featured_image} alt={q.data.title} className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover" />}
            <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-foreground/85">{q.data.content}</div>
          </>
        )}
      </article>
    </PublicLayout>
  );
}
