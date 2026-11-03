"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function maintenanceCreatePage() {
  return <ResourceFormView resource={getResource("maintenance")} mode="create" />;
}
