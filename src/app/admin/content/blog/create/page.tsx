"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function blogCreatePage() {
  return <ResourceFormView resource={getResource("blog")} mode="create" />;
}
