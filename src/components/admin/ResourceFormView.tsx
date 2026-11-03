"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ResourceForm } from "@/components/forms/ResourceForm";
import { AdminHeader } from "./AdminHeader";
import { api, unwrap } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import type { ResourceDef } from "@/lib/resources";

export function ResourceFormView({ resource, mode }: { resource: ResourceDef; mode: "create" | "edit" }) {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const id = params?.id;

  const editQuery = useQuery({
    enabled: mode === "edit" && !!id,
    queryKey: ["admin", resource.key, "edit", id],
    queryFn: async () => unwrap(await api.get(endpoints.admin.resourceItem(resource.endpoint, id!))),
  });

  const submitLabel = mode === "create" ? `Create ${resource.singular}` : `Save changes`;
  const title = mode === "create" ? `Create ${resource.singular}` : `Edit ${resource.singular}`;

  return (
    <div>
      <AdminHeader
        eyebrow={resource.title}
        title={title}
        description={`Fields submit canonical payloads to the API.`}
        action={
          <Button variant="outline" asChild>
            <Link href={`/admin/${resource.area}/${resource.key}`}>Back to list</Link>
          </Button>
        }
      />
      <div className="max-w-4xl rounded-xl border bg-card p-6 shadow-card lg:p-8">
        {mode === "edit" && editQuery.isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading record…</p>
        ) : mode === "edit" && editQuery.isError ? (
          <p className="py-8 text-center text-sm text-destructive">Failed to load this record.</p>
        ) : (
          <ResourceForm
            fields={resource.fields}
            defaultValues={mode === "edit" ? (editQuery.data as Record<string, any>) : undefined}
            submitLabel={submitLabel}
            onCancel={() => router.push(`/admin/${resource.area}/${resource.key}`)}
            onSubmit={async (payload) => {
              if (mode === "create") {
                await api.post(endpoints.admin.resource(resource.endpoint), payload);
              } else {
                await api.put(endpoints.admin.resourceItem(resource.endpoint, id!), payload);
              }
              qc.invalidateQueries({ queryKey: ["admin", resource.key] });
              router.push(`/admin/${resource.area}/${resource.key}`);
            }}
          />
        )}
      </div>
    </div>
  );
}
