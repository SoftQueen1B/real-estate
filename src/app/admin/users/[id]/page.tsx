"use client";

import { ResourceDetailView } from "@/components/admin/ResourceDetailView";
import { getResource } from "@/lib/get-resource";

export default function usersDetailPage() {
  return <ResourceDetailView resource={getResource("users")} />;
}
