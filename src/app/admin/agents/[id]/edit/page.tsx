"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function agentsEditPage() {
  return <ResourceFormView resource={getResource("agents")} mode="edit" />;
}
