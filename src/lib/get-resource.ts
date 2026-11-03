import { resources, type ResourceDef } from "./resources";

/** Get a resource by key, throwing if it doesn't exist (satisfies TS narrowing). */
export function getResource(key: string): ResourceDef {
  const r = resources[key];
  if (!r) throw new Error(`Unknown resource: ${key}`);
  return r;
}
