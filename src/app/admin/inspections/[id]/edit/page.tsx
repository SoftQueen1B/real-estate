"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function inspectionsEditPage() {
  return <ResourceFormView resource={getResource("inspections")} mode="edit" />;
}
