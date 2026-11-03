"use client";

import { ResourceDetailView } from "@/components/admin/ResourceDetailView";
import { getResource } from "@/lib/get-resource";

export default function propertiesDetailPage() {
  return <ResourceDetailView resource={getResource("properties")} />;
}
