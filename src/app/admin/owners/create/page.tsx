"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function ownersCreatePage() {
  return <ResourceFormView resource={getResource("owners")} mode="create" />;
}
