"use client";

import { ResourceDetailView } from "@/components/admin/ResourceDetailView";
import { getResource } from "@/lib/get-resource";

export default function agentsDetailPage() {
  return <ResourceDetailView resource={getResource("agents")} />;
}
