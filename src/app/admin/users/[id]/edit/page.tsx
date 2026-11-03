"use client";

import { ResourceFormView } from "@/components/admin/ResourceFormView";
import { getResource } from "@/lib/get-resource";

export default function usersEditPage() {
  return <ResourceFormView resource={getResource("users")} mode="edit" />;
}
