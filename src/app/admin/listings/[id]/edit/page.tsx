"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function listingsEditPage() {
  return <ResourceFormView resource={getResource("listings")} mode="edit" />;
}
