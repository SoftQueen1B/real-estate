"use client";

import { ResourceDetailView } from "@/components/admin/ResourceDetailView";
import { getResource } from "@/lib/get-resource";

export default function faqsDetailPage() {
  return <ResourceDetailView resource={getResource("faqs")} />;
}
