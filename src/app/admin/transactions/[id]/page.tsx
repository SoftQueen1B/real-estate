"use client";

import { ResourceDetailView } from "@/components/admin/ResourceDetailView";
import { getResource } from "@/lib/get-resource";

export default function transactionsDetailPage() {
  return <ResourceDetailView resource={getResource("transactions")} />;
}
