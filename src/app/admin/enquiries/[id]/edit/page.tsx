"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function enquiriesEditPage() {
  return <ResourceFormView resource={getResource("enquiries")} mode="edit" />;
}
