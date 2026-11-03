"use client";

import Link from "next/link";
import { CalendarDays, ClipboardList, MessageSquare, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminHeader } from "./AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDashboardSummary } from "@/services/dashboard.service";
import { formatDate, humanize } from "@/lib/format";

const TONE_CLASS: Record<string, string> = {
  wine: "text-primary",
  gold: "text-gold-foreground",
  green: "text-success",
  blue: "text-blue-600",
};

export function DashboardOverview() {
  const q = useQuery({ queryKey: ["admin", "dashboard"], queryFn: getDashboardSummary });

  if (q.isLoading) {
    return (
      <div>
        <AdminHeader title="Overview" eyebrow="Workspace" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl border bg-card" />
          ))}
        </div>
      </div>
    );
  }

  if (q.isError || !q.data) {
    return (
      <div>
        <AdminHeader title="Overview" eyebrow="Workspace" />
        <div className="rounded-xl border border-destructive/30 bg-card p-10 text-center">
          <p className="text-destructive">Couldn't load the dashboard.</p>
          <Button variant="outline" className="mt-4" onClick={() => q.refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const d = q.data;

  return (
    <div>
      <AdminHeader
        title="Overview"
        eyebrow="Workspace"
        description="Manage your real estate operations with clarity."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {d.metrics.map((m) => (
          <Link
            key={m.key}
            href={m.href}
            className="group rounded-xl border bg-card p-5 shadow-card transition-shadow hover:shadow-elegant"
          >
            <div className="flex items-start justify-between">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <TrendingUp className={`size-4 ${TONE_CLASS[m.tone] ?? "text-primary"}`} />
            </div>
            <p className="mt-4 font-display text-3xl text-burgundy">{m.value}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">{m.change}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-burgundy">Property mix by type</CardTitle>
          </CardHeader>
          <CardContent>
            {d.propertyMix.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={d.propertyMix}>
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.5rem",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-background)",
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {d.propertyMix.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">No properties yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-burgundy">Listings by purpose</CardTitle>
          </CardHeader>
          <CardContent>
            {d.listingMix.some((l) => l.value > 0) ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={d.listingMix}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={(entry: { label: string; value: number }) => `${entry.label} (${entry.value})`}
                  >
                    {d.listingMix.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">No listings yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-burgundy">Recent enquiries</CardTitle>
              <Link href="/admin/enquiries" className="text-xs font-semibold text-primary hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {d.enquiries.length > 0 ? (
              <ul className="space-y-4">
                {d.enquiries.map((e) => (
                  <li key={e.id} className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
                    <MessageSquare className="mt-0.5 size-4 shrink-0 text-gold" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{e.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{e.subject || e.listing}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(e.created_at)}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                      {humanize(e.status)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No enquiries yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-burgundy">Upcoming inspections</CardTitle>
              <Link href="/admin/inspections" className="text-xs font-semibold text-primary hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {d.inspections.length > 0 ? (
              <ul className="space-y-4">
                {d.inspections.map((i) => (
                  <li key={i.id} className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-gold" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{i.property}</p>
                      <p className="text-sm text-muted-foreground">{i.client}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDate(i.requested_date)} · {i.requested_time}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                      {humanize(i.status)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No inspections scheduled.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {d.activity.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-burgundy">Recent activity</CardTitle>
              <Link href="/admin/reports" className="text-xs font-semibold text-primary hover:underline">
                View reports
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {d.activity.map((a, idx) => (
                <li key={idx} className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
                  <ClipboardList className="mt-0.5 size-4 shrink-0 text-gold" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{a.label}</p>
                    <p className="text-sm text-muted-foreground">{a.detail}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{a.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
