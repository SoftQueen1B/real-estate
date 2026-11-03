"use client";

import { ResourceDetailView } from "@/components/admin/ResourceDetailView";
import { getResource } from "@/lib/get-resource";

export default function paymentsDetailPage() {
  return <ResourceDetailView resource={getResource("payments")} />;
}
