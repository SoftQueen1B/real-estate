"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function expensesEditPage() {
  return <ResourceFormView resource={getResource("expenses")} mode="edit" />;
}
