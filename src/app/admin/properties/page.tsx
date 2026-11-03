"use client";

import { ResourceListView } from "@/components/admin/ResourceListView";
import { AdminHeader } from "@/components/admin/AdminShell";
import { getResource } from "@/lib/get-resource";

export default function propertiesListPage() {
  const resource = getResource("properties");
  return (
    <div>
      <AdminHeader title={resource.title} eyebrow="Workspace" />
      <ResourceListView resource={resource} />
    </div>
  );
}
