"use client";

import Link from "next/link";
import { ChartBar as BarChart3, TrendingUp } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const REPORTS = [
  { key: "sales", title: "Sales performance", desc: "Closed deals, revenue and agent performance over time." },
  { key: "rental", title: "Rental income", desc: "Active tenancies, rent collection and arrears." },
  { key: "leads", title: "Lead conversion", desc: "Enquiry-to-client funnel by source and agent." },
  { key: "expenses", title: "Expense breakdown", desc: "Operating costs by category and property." },
];

export default function ReportsPage() {
  return (
    <div>
      <AdminHeader
        title="Reports"
        eyebrow="Workspace"
        description="Generate and export operational reports."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((r) => (
          <Card key={r.key}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <BarChart3 className="size-5 text-gold" />
                <CardTitle className="text-burgundy">{r.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{r.desc}</p>
              <Button variant="outline" size="sm" className="mt-4">
                <TrendingUp className="mr-1 size-3" />
                Generate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-lg text-burgundy">Custom report</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Need something specific? Export raw data for external analysis.
              </p>
            </div>
            <Link
              href="/admin"
              className="rounded-md border border-input px-4 py-2 text-xs font-semibold hover:bg-muted"
            >
              Back to overview
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
