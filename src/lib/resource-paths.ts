import type { ResourceDef } from "./resources";

/** Admin URL base for a resource: /admin/{key} or /admin/content/{key} for content resources. */
export function resourceBasePath(resource: ResourceDef): string {
  return resource.area === "content"
    ? `/admin/content/${resource.key}`
    : `/admin/${resource.key}`;
}
