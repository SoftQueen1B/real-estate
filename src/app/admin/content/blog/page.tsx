"use client";

import { ResourceListView } from "@/components/admin/ResourceListView";
import { AdminHeader } from "@/components/admin/AdminShell";
import { getResource } from "@/lib/get-resource";

export default function blogListPage() {
  const resource = getResource("blog");
  return (
    <div>
      <AdminHeader title={resource.title} eyebrow="Content" />
      <ResourceListView resource={resource} />
    </div>
  );
}
