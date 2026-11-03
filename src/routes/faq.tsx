"use client";
import { Link } from "@/lib/legacy-router";
import { useQuery } from "@tanstack/react-query";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHero, PublicLayout } from "@/components/site/SiteChrome";
import { EmptyState, ErrorState, Spinner } from "@/components/site/StateViews";
import { api, toPaginated } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import type { Faq } from "@/lib/types";

export function FaqPage() {
  const q = useQuery({ queryKey: ["public", "faqs"], queryFn: async () => toPaginated<Faq>(await api.get(endpoints.public.faqs)).data });
  return (
    <PublicLayout>
      <PageHero eyebrow="Help" title="Frequently asked questions" />
      <div className="container-page max-w-3xl py-14">
        {q.isLoading ? <Spinner /> : q.isError ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> : q.data?.length ? (
          <Accordion type="single" collapsible className="rounded-xl border bg-card px-6">
            {q.data.map((f) => (
              <AccordionItem key={f.id} value={String(f.id)}>
                <AccordionTrigger className="text-left font-display text-lg">{f.question}</AccordionTrigger>
                <AccordionContent className="whitespace-pre-line text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : <EmptyState title="No questions yet" />}
        <p className="mt-10 text-center text-sm text-muted-foreground">Still have questions? <Link to="/contact" className="text-primary underline">Contact us</Link>.</p>
      </div>
    </PublicLayout>
  );
}
