/**
 * "mock" (default) answers every request from the in-browser sample provider.
 * "api" sends requests to the Laravel API and never substitutes sample records.
 */
export type DataMode = "mock" | "api";

export const DATA_MODE: DataMode = process.env.NEXT_PUBLIC_DATA_MODE === "api" ? "api" : "mock";
