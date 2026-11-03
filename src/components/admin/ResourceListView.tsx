"use client";

import Link from "next/link";
import { ChevronDown, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, toPaginated, type Paginated } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { formatMoney, humanize, formatDate } from "@/lib/format";
import type { ColumnDef, ResourceDef } from "@/lib/resources";
import { ErrorState, LoadingGrid } from "@/components/site/StateViews";
import { resourceBasePath } from "@/lib/resource-paths";

function renderCell(col: ColumnDef, row: Record<string, any>): string {
  if (col.render) return col.render(row);
  const raw = row[col.key];
  if (raw === null || raw === undefined) return "—";
  switch (col.format) {
    case "money":
      return formatMoney(raw, col.currencyKey ? row[col.currencyKey] : "NGN");
    case "date":
      return formatDate(raw);
    case "status":
      return humanize(raw);
    case "bool":
      return raw ? "Yes" : "No";
    default:
      return String(raw);
  }
}

export function ResourceListView({ resource }: { resource: ResourceDef }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", resource.key, { search, status: statusFilter, page }],
    queryFn: async () => {
      const params: Record<string, string | number | boolean | null | undefined> = {
        search: search || undefined,
        page,
        per_page: 10,
      };
      if (statusFilter) params["status"] = statusFilter;
      const res = await api.get<Paginated<Record<string, any>>>(
        endpoints.admin.resource(resource.endpoint),
        params,
      );
      return toPaginated<Record<string, any>>(res);
    },
  });

  const remove = async (id: number) => {
    if (!confirm("Delete this record? This cannot be undone.")) return;
    await api.delete(endpoints.admin.resourceItem(resource.endpoint, id));
    qc.invalidateQueries({ queryKey: ["admin", resource.key] });
  };

  const data = query.data;
  const showAdd = !resource.readOnlyCreate;

  return (
    <div className="rounded-xl border bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b p-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={`Search ${resource.title.toLowerCase()}…`}
              className="w-48 bg-transparent text-sm outline-none"
            />
          </div>
          {resource.statusFilter && (
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="h-8 rounded-md border border-input bg-background px-3 text-xs"
              >
                <option value="">All statuses</option>
                {resource.statusFilter.map((s) => (
                  <option key={s} value={s}>
                    {humanize(s)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export <ChevronDown className="ml-1 size-3" />
          </Button>
          {showAdd && (
            <Button asChild size="sm">
              <Link href={`${resourceBasePath(resource)}/create`}>Add {resource.singular}</Link>
            </Button>
          )}
        </div>
      </div>

      {query.isLoading ? (
        <div className="p-6">
          <LoadingGrid count={4} />
        </div>
      ) : query.isError ? (
        <div className="p-6">
          <ErrorState error={query.error} onRetry={() => query.refetch()} />
        </div>
      ) : !data?.data.length ? (
        <div className="p-10 text-center text-sm text-muted-foreground">No {resource.title.toLowerCase()} found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-secondary text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                {resource.columns.map((col) => (
                  <th key={col.key} className="px-5 py-4 font-semibold">
                    {col.label}
                  </th>
                ))}
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((row) => (
                <tr key={row["id"]} className="border-t border-border hover:bg-muted/30">
                  {resource.columns.map((col) => (
                    <td key={col.key} className="px-5 py-4">
                      {col.format === "status" ? (
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                          {renderCell(col, row)}
                        </span>
                      ) : (
                        <span className={col.key === resource.columns[0]?.key ? "font-semibold text-burgundy" : "text-muted-foreground"}>
                          {renderCell(col, row)}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`${resourceBasePath(resource)}/${row["id"]}`}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        View
                      </Link>
                      {!resource.readOnlyCreate && (
                        <Link
                          href={`${resourceBasePath(resource)}/${row["id"]}/edit`}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          Edit
                        </Link>
                      )}
                      <button
                        onClick={() => void remove(row["id"])}
                        className="text-destructive hover:opacity-70"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-3 border-t p-4">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {data.meta.last_page}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.meta.last_page}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
