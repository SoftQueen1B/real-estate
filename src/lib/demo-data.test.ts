import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { filterSampleProperties, getSampleResponse, sampleProperties } from "./demo-data";

describe("sample frontend content", () => {
  it("filters, sorts and paginates sample properties", () => {
    expect(filterSampleProperties({ purpose: "rent", city: "Port Harcourt" }).map((row) => row.slug)).toEqual(["modern-port-harcourt-apartment"]);
    const rows = filterSampleProperties({ min_price: "32000000", max_price: "45000000", sort: "price_asc" });
    expect(rows.map((row) => row.listing?.price)).toEqual(["32000000", "45000000"]);
    expect(getSampleResponse("/public/properties", { per_page: 3, page: 2 })).toMatchObject({ data: expect.any(Array), meta: { current_page: 2, last_page: 3, total: 8 } });
  });
  it("provides detail records for sample links without inventing unknown records", () => {
    for (const property of sampleProperties) expect(getSampleResponse(`/public/properties/${property.slug}`)).toEqual(property);
    expect(getSampleResponse("/public/properties/not-a-listing")).toBeUndefined();
  });
});

describe("data mode and live API", () => {
  beforeEach(() => { vi.resetModules(); localStorage.clear(); });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it("serves public sample content in mock mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_DATA_MODE", "mock");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");
    const { api } = await import("./api");
    expect(await api.get("/public/properties")).toMatchObject({ meta: { total: 8 } });
  });
  it("returns live results as authoritative, including empty lists", async () => {
    vi.stubEnv("NEXT_PUBLIC_DATA_MODE", "api");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.com");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: [] }), { status: 200 })));
    const { api } = await import("./api");
    expect(await api.get("/public/properties")).toEqual({ data: [] });
  });
  it("surfaces network failures in api mode instead of sample records", async () => {
    vi.stubEnv("NEXT_PUBLIC_DATA_MODE", "api");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.com");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("network unavailable")));
    const { api } = await import("./api");
    await expect(api.get("/public/properties")).rejects.toMatchObject({ status: 0 });
  });
  it("surfaces unavailable endpoints in api mode instead of sample records", async () => {
    vi.stubEnv("NEXT_PUBLIC_DATA_MODE", "api");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.com");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 503 })));
    const { api } = await import("./api");
    await expect(api.get("/admin/dashboard")).rejects.toMatchObject({ status: 503 });
  });
  it("does not replace authorization errors with sample data", async () => {
    vi.stubEnv("NEXT_PUBLIC_DATA_MODE", "api");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.com");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 403 })));
    const { api } = await import("./api");
    await expect(api.get("/public/properties")).rejects.toMatchObject({ status: 403 });
  });
  it("reports an unconfigured live API in api mode without submitting", async () => {
    vi.stubEnv("NEXT_PUBLIC_DATA_MODE", "api");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");
    const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
    const { api } = await import("./api");
    await expect(api.post("/public/enquiries", { name: "Sample" })).rejects.toThrow("Nothing has been submitted");
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("never treats a public submission as saved in mock mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_DATA_MODE", "mock");
    const { api } = await import("./api");
    await expect(api.post("/public/enquiries", { name: "Sample" })).rejects.toThrow("Nothing has been submitted");
  });
  it("keeps mock admin changes in memory and updates dashboard counts", async () => {
    vi.stubEnv("NEXT_PUBLIC_DATA_MODE", "mock");
    const { api } = await import("./api");
    type Summary = { metrics: { key: string; value: number | string }[] };
    const metric = (summary: Summary, key: string) => summary.metrics.find((m) => m.key === key)?.value;

    const before = await api.get<Summary>("/admin/dashboard");
    const openBefore = metric(before, "enquiries");

    const created = await api.post<{ id: number }>("/admin/properties", { title: "Mock test villa", owner_id: 1, property_type: "duplex", city: "Lekki", state: "Lagos", status: "draft", amenity_ids: [] });
    expect(await api.get("/admin/properties", { search: "Mock test villa" })).toMatchObject({ meta: { total: 1 } });

    await api.put(`/admin/properties/${created.id}`, { title: "Renamed villa" });
    expect(await api.get("/admin/properties", { search: "Renamed villa" })).toMatchObject({ meta: { total: 1 } });

    await api.patch("/admin/enquiries/1/status", { status: "closed" });
    expect(metric(await api.get<Summary>("/admin/dashboard"), "enquiries")).toBe(Number(openBefore) - 1);

    await api.delete(`/admin/properties/${created.id}`);
    expect(await api.get("/admin/properties", { search: "Renamed villa" })).toMatchObject({ meta: { total: 0 } });
  });
});
