"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function clientsCreatePage() {
  return <ResourceFormView resource={getResource("clients")} mode="create" />;
}
