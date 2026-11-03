"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function usersCreatePage() {
  return <ResourceFormView resource={getResource("users")} mode="create" />;
}
