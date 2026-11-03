"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function clientsEditPage() {
  return <ResourceFormView resource={getResource("clients")} mode="edit" />;
}
