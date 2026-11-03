export type DashboardData = {
  metrics: { key: string; label: string; value: number | string; change: string; tone: "wine" | "gold" | "green" | "blue"; href: string }[];
  propertyMix: { label: string; value: number; color: string }[];
  listingMix: { label: string; value: number; color: string }[];
  enquiries: { id: number; name: string; subject: string; listing: string; status: string; created_at: string }[];
  inspections: { id: number; property: string; client: string; requested_date: string; requested_time: string; status: string }[];
  activity: { label: string; detail: string; time: string; tone: string }[];
};
