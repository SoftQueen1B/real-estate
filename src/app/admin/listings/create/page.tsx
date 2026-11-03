"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function listingsCreatePage() {
  return <ResourceFormView resource={getResource("listings")} mode="create" />;
}
