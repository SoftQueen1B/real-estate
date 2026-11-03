import { api, unwrap } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import { endpoints } from "@/lib/endpoints";
import type { DashboardData } from "@/types/dashboard";

const SECTIONS = ["metrics", "propertyMix", "listingMix", "enquiries", "inspections", "activity"] as const;

function isDashboardData(value: unknown): value is DashboardData {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return SECTIONS.every((key) => Array.isArray(record[key]));
}

export async function getDashboardSummary(): Promise<DashboardData> {
  const res = unwrap(await api.get<unknown>(endpoints.admin.dashboard));
  if (!isDashboardData(res)) throw new ApiError("The dashboard returned an unexpected response.", 0);
  return res;
}
