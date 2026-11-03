"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function ownersEditPage() {
  return <ResourceFormView resource={getResource("owners")} mode="edit" />;
}
