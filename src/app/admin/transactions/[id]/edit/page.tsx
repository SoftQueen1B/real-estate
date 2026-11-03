"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function transactionsEditPage() {
  return <ResourceFormView resource={getResource("transactions")} mode="edit" />;
}
