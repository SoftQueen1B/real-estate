/**
 * Answers API-shaped requests in mock mode. Public reads come from the sample site content;
 * admin resources are served and changed in the in-memory store.
 */
import { ApiError } from "@/lib/api-error";
import { getSampleResponse, sampleUser } from "@/lib/demo-data";
import { createRow, dashboardSummary, deleteRow, getRow, listRows, updateRow } from "./admin-store";
import type { MockRow } from "./admin-fixtures";

const STORE_RESOURCES = new Set([
  "properties", "listings", "owners", "clients", "agents", "enquiries", "inspections", "transactions",
  "tenancies", "payments", "expenses", "maintenance-requests", "users", "pages", "blog-posts", "faqs",
  "testimonials", "amenities",
]);

const NOT_IN_SAMPLE = new ApiError("This section isn't available in sample data.", 404);

function toPlainBody(body: unknown): MockRow {
  if (body instanceof FormData) {
    const out: MockRow = {};
    body.forEach((value, key) => {
      if (value instanceof File) return;
      if (key.endsWith("[]")) {
        const bare = key.slice(0, -2);
        out[bare] = [...(out[bare] ?? []), value];
      } else {
        out[key] = value;
      }
    });
    delete out["_method"];
    return out;
  }
  if (body && typeof body === "object") {
    const out: MockRow = { ...(body as MockRow) };
    delete out["_method"];
    return out;
  }
  return {};
}

export function mockRequest<T>(method: string, path: string, query: Record<string, unknown>, body: unknown): T {
  if (path.startsWith("/public/")) {
    if (method === "GET") return getSampleResponse(path, query) as T;
    throw new ApiError("The live property service isn't connected yet. Nothing has been submitted.", 0);
  }
  if (path.startsWith("/auth/")) throw new ApiError("Sign-in needs the live service.", 0);
  if (method === "GET" && path === "/admin/dashboard") return dashboardSummary() as T;
  if (method === "GET" && path === "/admin/profile") return sampleUser as T;
  if (method === "GET" && path === "/admin/notifications") return listRows("enquiries", { status: "new" }) as T;

  const match = path.match(/^\/admin\/([^/]+)(?:\/(\d+)(\/status)?)?$/);
  const name = match?.[1];
  if (!match || !name || !STORE_RESOURCES.has(name)) throw NOT_IN_SAMPLE;

  const spoofedPut = body instanceof FormData && body.get("_method") === "PUT";
  const verb = method === "POST" && spoofedPut ? "PUT" : method;
  const id = match[2] === undefined ? undefined : Number(match[2]);
  const payload = toPlainBody(body);

  if (id === undefined) {
    if (verb === "GET") return listRows(name, query) as T;
    if (verb === "POST") return createRow(name, payload) as T;
  } else if (match[3] && verb === "PATCH") {
    return updateRow(name, id, { status: payload["status"] }) as T;
  } else if (verb === "GET") {
    return getRow(name, id) as T;
  } else if (verb === "PUT") {
    return updateRow(name, id, payload) as T;
  } else if (verb === "DELETE") {
    deleteRow(name, id);
    return undefined as T;
  }
  throw new ApiError("This action isn't available in sample data.", 405);
}
