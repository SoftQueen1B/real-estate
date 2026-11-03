"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function faqsEditPage() {
  return <ResourceFormView resource={getResource("faqs")} mode="edit" />;
}
