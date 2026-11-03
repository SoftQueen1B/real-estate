"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function tenanciesEditPage() {
  return <ResourceFormView resource={getResource("tenancies")} mode="edit" />;
}
