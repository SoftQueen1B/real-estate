"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function agentsCreatePage() {
  return <ResourceFormView resource={getResource("agents")} mode="create" />;
}
