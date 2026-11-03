"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AdminHeader } from "./AdminHeader";
import { api, unwrap } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { formatDate, formatMoney, humanize } from "@/lib/format";
import type { ColumnDef, ResourceDef } from "@/lib/resources";
import { ErrorState, Spinner } from "@/components/site/StateViews";

function renderValue(col: ColumnDef, row: Record<string, any>): React.ReactNode {
  if (col.render) return col.render(row);
  const raw = row[col.key];
  if (raw === null || raw === undefined) return "—";
  switch (col.format) {
    case "money":
      return formatMoney(raw, col.currencyKey ? row[col.currencyKey] : "NGN");
    case "date":
      return formatDate(raw);
    case "status":
      return <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">{humanize(raw)}</span>;
    case "bool":
      return raw ? "Yes" : "No";
    default:
      return String(raw);
  }
}

export function ResourceDetailView({ resource }: { resource: ResourceDef }) {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const q = useQuery({
    queryKey: ["admin", resource.key, "detail", id],
    queryFn: async () => unwrap(await api.get(endpoints.admin.resourceItem(resource.endpoint, id!))),
  });

  return (
    <div>
      <AdminHeader
        eyebrow={resource.title}
        title={resource.singular}
        description={`Record #${id}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/${resource.area}/${resource.key}`}>Back to list</Link>
            </Button>
            {!resource.readOnlyCreate && (
              <Button asChild>
                <Link href={`/admin/${resource.area}/${resource.key}/${id}/edit`}>Edit</Link>
              </Button>
            )}
          </div>
        }
      />
      <div className="max-w-3xl rounded-xl border bg-card p-6 shadow-card lg:p-8">
        {q.isLoading ? (
          <Spinner label="Loading record" />
        ) : q.isError || !q.data ? (
          <ErrorState error={q.error} onRetry={() => q.refetch()} />
        ) : (
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {resource.columns.map((col) => (
              <div key={col.key}>
                <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{col.label}</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{renderValue(col, q.data as Record<string, any>)}</dd>
              </div>
            ))}
            {resource.fields.map((field) => {
              if (resource.columns.some((c) => c.key === field.name)) return null;
              const raw = (q.data as Record<string, any>)[field.name];
              if (raw === null || raw === undefined || raw === "") return null;
              return (
                <div key={field.name}>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{field.label}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">
                    {field.type === "textarea" ? (
                      <span className="whitespace-pre-line">{String(raw)}</span>
                    ) : field.type === "checkbox" ? (
                      raw ? "Yes" : "No"
                    ) : (
                      String(raw)
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        )}
      </div>
    </div>
  );
}
