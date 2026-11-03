"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function enquiriesCreatePage() {
  return <ResourceFormView resource={getResource("enquiries")} mode="create" />;
}
