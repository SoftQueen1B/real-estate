import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { BlogPost, PublicAgent } from "@/lib/types";

export function AgentTile({ agent }: { agent: PublicAgent }) {
  return (
    <Link href={`/agents/${agent.id}`} className="group block overflow-hidden rounded-xl border bg-card text-center shadow-card hover:shadow-elegant">
      <div className="aspect-square bg-muted">{agent.profile_image ? <img src={agent.profile_image} alt={`${agent.first_name} ${agent.last_name}`} loading="lazy" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center font-display text-5xl text-primary/40">{agent.first_name[0]}{agent.last_name[0]}</div>}</div>
      <div className="p-5"><h3 className="text-lg group-hover:text-primary">{agent.first_name} {agent.last_name}</h3><p className="text-sm text-muted-foreground">{agent.specialization ?? "Real estate agent"}</p></div>
    </Link>
  );
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block overflow-hidden rounded-xl border bg-card shadow-card hover:shadow-elegant">
      <div className="aspect-[16/10] bg-muted">{post.featured_image && <img src={post.featured_image} alt={post.title} loading="lazy" className="h-full w-full object-cover" />}</div>
      <div className="p-6"><p className="text-xs uppercase tracking-wider text-gold">{post.category ?? "Insights"} · {formatDate(post.published_at)}</p><h3 className="mt-2 text-xl group-hover:text-primary">{post.title}</h3>{post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>}</div>
    </Link>
  );
}
