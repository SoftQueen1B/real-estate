"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function maintenanceEditPage() {
  return <ResourceFormView resource={getResource("maintenance")} mode="edit" />;
}
