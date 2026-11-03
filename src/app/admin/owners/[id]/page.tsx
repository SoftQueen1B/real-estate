"use client";

import { ResourceDetailView } from "@/components/admin/ResourceDetailView";
import { getResource } from "@/lib/get-resource";

export default function ownersDetailPage() {
  return <ResourceDetailView resource={getResource("owners")} />;
}
