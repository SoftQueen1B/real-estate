/**
 * In-memory mock data store for mock mode. Lives only for the current browser session;
 * nothing written here reaches the database.
 */
import { ApiError } from "@/lib/api-error";
import { formatMoney, humanize } from "@/lib/format";
import type { DashboardData } from "@/types/dashboard";
import { mockActivity, seedTables, type MockRow } from "./admin-fixtures";

type Query = Record<string, unknown>;

const PAGE_SIZE = 10;
const PALETTE = ["#761A36", "#D6B15C", "#8f5165", "#4A1024", "#B8926A", "#5C4A4F"];
const tables = new Map<string, MockRow[]>();

function rows(name: string): MockRow[] {
  let list = tables.get(name);
  if (!list) {
    list = structuredClone(seedTables[name] ?? []);
    tables.set(name, list);
  }
  return list;
}

function notFound() {
  return new ApiError("We couldn't find what you were looking for.", 404);
}

function find(name: string, id: unknown): MockRow | undefined {
  const numeric = Number(id);
  return rows(name).find((row) => row["id"] === numeric);
}

function related(name: string, row: MockRow): MockRow {
  switch (name) {
    case "owners":
      return { ...row, properties_count: rows("properties").filter((p) => p["owner_id"] === row["id"]).length };
    case "properties":
      return { ...row, owner: find("owners", row["owner_id"]) ?? null };
    case "listings":
      return { ...row, property: find("properties", row["property_id"]) ?? null, agent: find("agents", row["agent_id"]) ?? null };
    case "enquiries":
    case "inspections": {
      const listing = find("listings", row["listing_id"]);
      return { ...row, listing: listing ? related("listings", listing) : null };
    }
    default:
      return row;
  }
}

function nextId(list: MockRow[]): number {
  return list.reduce((max, row) => Math.max(max, Number(row["id"])), 0) + 1;
}

export function listRows(name: string, query: Query) {
  const term = String(query["search"] ?? "").trim().toLowerCase();
  const status = query["status"] ? String(query["status"]) : "";
  const matches = rows(name)
    .filter((row) => (!status || row["status"] === status) && (!term || JSON.stringify(row).toLowerCase().includes(term)))
    .sort((a, b) => Number(b["id"]) - Number(a["id"]));
  const lastPage = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(query["page"]) || 1), lastPage);
  return {
    data: matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((row) => related(name, row)),
    meta: { current_page: page, last_page: lastPage, per_page: PAGE_SIZE, total: matches.length },
  };
}

export function getRow(name: string, id: number): MockRow {
  const row = find(name, id);
  if (!row) throw notFound();
  return related(name, row);
}

export function createRow(name: string, values: MockRow): MockRow {
  const list = rows(name);
  const now = new Date().toISOString();
  const row = { ...values, id: nextId(list), created_at: now, updated_at: now };
  list.push(row);
  return related(name, row);
}

export function updateRow(name: string, id: number, changes: MockRow): MockRow {
  const row = find(name, id);
  if (!row) throw notFound();
  Object.assign(row, changes, { id: row["id"], updated_at: new Date().toISOString() });
  return related(name, row);
}

export function deleteRow(name: string, id: number): void {
  const list = rows(name);
  const index = list.findIndex((row) => row["id"] === id);
  if (index < 0) throw notFound();
  list.splice(index, 1);
}

function propertyTitle(listingId: unknown): string {
  const listing = find("listings", listingId);
  const property = find("properties", listing?.["property_id"]);
  return property?.["title"] ? String(property["title"]) : "Not linked to a listing";
}

function countBy(list: MockRow[], key: string, labelOf: (value: string) => string) {
  const counts = new Map<string, number>();
  list.forEach((row) => {
    const value = String(row[key] ?? "other");
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });
  return [...counts.entries()].map(([value, count], index) => ({
    label: labelOf(value),
    value: count,
    color: PALETTE[index % PALETTE.length] ?? "#761A36",
  }));
}

const sumOf = (list: MockRow[], predicate: (row: MockRow) => boolean) =>
  list.filter(predicate).reduce((total, row) => total + Number(row["amount"] ?? 0), 0);

/** Summary computed from the store, so counts follow every create, edit and delete. */
export function dashboardSummary(): DashboardData {
  const properties = rows("properties");
  const listings = rows("listings");
  const enquiries = rows("enquiries");
  const inspections = rows("inspections");
  const activeListings = listings.filter((listing) => listing["status"] === "active");
  const forPurpose = (purpose: string) => activeListings.filter((listing) => listing["listing_purpose"] === purpose).length;
  const openEnquiries = enquiries.filter((row) => row["status"] === "new" || row["status"] === "in_progress");
  const pendingInspections = inspections.filter((row) => row["status"] === "pending");
  const transactionsInProgress = rows("transactions").filter((row) => row["status"] === "pending" || row["status"] === "in_progress");
  const activeTenancies = rows("tenancies").filter((row) => row["status"] === "active");
  const month = new Date().toISOString().slice(0, 7);

  return {
    metrics: [
      { key: "properties", label: "Total properties", value: properties.length, change: `${properties.filter((p) => p["status"] === "published").length} published`, tone: "wine", href: "/admin/properties" },
      { key: "listings", label: "Active listings", value: activeListings.length, change: `of ${listings.length} listings`, tone: "gold", href: "/admin/listings" },
      { key: "sale", label: "Properties for sale", value: forPurpose("sale"), change: "Active sale listings", tone: "blue", href: "/admin/listings" },
      { key: "rent", label: "Properties for rent", value: forPurpose("rent"), change: "Active rental listings", tone: "green", href: "/admin/listings" },
      { key: "enquiries", label: "Pending enquiries", value: openEnquiries.length, change: `${enquiries.filter((e) => e["status"] === "new").length} new`, tone: "blue", href: "/admin/enquiries" },
      { key: "inspections", label: "Pending inspections", value: pendingInspections.length, change: "Awaiting confirmation", tone: "green", href: "/admin/inspections" },
      { key: "transactions", label: "Transactions in progress", value: transactionsInProgress.length, change: "Pending or in progress", tone: "wine", href: "/admin/transactions" },
      { key: "tenancies", label: "Active tenancies", value: activeTenancies.length, change: "Active agreements", tone: "wine", href: "/admin/tenancies" },
      { key: "payments", label: "Verified payments", value: formatMoney(sumOf(rows("payments"), (row) => row["status"] === "verified")), change: "Verified only", tone: "gold", href: "/admin/payments" },
      { key: "expenses", label: "Expenses this month", value: formatMoney(sumOf(rows("expenses"), (row) => String(row["expense_date"] ?? "").startsWith(month))), change: "Current calendar month", tone: "gold", href: "/admin/expenses" },
    ],
    propertyMix: countBy(properties, "property_type", humanize),
    listingMix: ["sale", "rent", "lease"].map((purpose, index) => ({
      label: `For ${purpose}`,
      value: forPurpose(purpose),
      color: PALETTE[index] ?? "#761A36",
    })),
    enquiries: [...enquiries]
      .sort((a, b) => String(b["created_at"]).localeCompare(String(a["created_at"])))
      .slice(0, 5)
      .map((row) => ({
        id: Number(row["id"]),
        name: String(row["name"]),
        subject: String(row["subject"] ?? ""),
        listing: propertyTitle(row["listing_id"]),
        status: String(row["status"]),
        created_at: String(row["created_at"]),
      })),
    inspections: inspections
      .filter((row) => row["status"] === "pending" || row["status"] === "confirmed")
      .sort((a, b) => String(a["requested_date"]).localeCompare(String(b["requested_date"])))
      .slice(0, 5)
      .map((row) => ({
        id: Number(row["id"]),
        property: propertyTitle(row["listing_id"]),
        client: String(row["name"]),
        requested_date: String(row["requested_date"]),
        requested_time: String(row["requested_time"]),
        status: String(row["status"]),
      })),
    activity: mockActivity,
  };
}
