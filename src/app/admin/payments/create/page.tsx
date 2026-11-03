"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function paymentsCreatePage() {
  return <ResourceFormView resource={getResource("payments")} mode="create" />;
}
