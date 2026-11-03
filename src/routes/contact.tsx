import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero, PublicLayout } from "@/components/site/SiteChrome";
import { PublicForm } from "@/components/site/PublicForm";
import { endpoints } from "@/lib/endpoints";
import type { FieldDef } from "@/lib/resources";

const FIELDS: FieldDef[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "subject", label: "Subject", type: "text", required: true },
  { name: "message", label: "Message", type: "textarea", required: true, span: 2 },
];

export function Contact() {
  return (
    <PublicLayout>
      <PageHero eyebrow="Contact" title="Let's talk property" description="Send us a message and the right person will get back to you." />
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border bg-card p-6 shadow-card md:p-10">
          <PublicForm fields={FIELDS} endpoint={endpoints.public.contact} submitLabel="Send message" successTitle="Message sent" successText="Thank you for reaching out. We'll reply within one business day." />
        </div>
        <aside className="space-y-5 rounded-2xl bg-burgundy p-8 text-secondary">
          <h2 className="text-2xl text-primary-foreground">Visit or call</h2>
          {[[MapPin, "Port Harcourt, Rivers State, Nigeria"], [Phone, "+234 800 000 0000"], [Mail, "hello@lenarealestate.com"], [Clock, "Mon – Fri, 9am – 6pm · Sat, 10am – 2pm"]].map(([Icon, t]: any) => (
            <p key={t} className="flex items-start gap-3 text-sm"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />{t}</p>
          ))}
        </aside>
      </div>
    </PublicLayout>
  );
}
