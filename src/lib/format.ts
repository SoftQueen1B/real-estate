/**
 * Display-only money formatting. Amounts are kept as the strings returned by the
 * API (decimal-safe) and never used for authoritative arithmetic in the browser.
 */
export function formatMoney(amount: string | number | null | undefined, currency = "NGN"): string {
  if (amount === null || amount === undefined || amount === "") return "—";
  const str = String(amount);
  const [whole = "", frac] = str.split(".");
  const negative = whole.startsWith("-");
  const digits = whole.replace("-", "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const symbol = currency === "NGN" ? "₦" : currency === "USD" ? "$" : currency === "GBP" ? "£" : `${currency} `;
  const cents = frac && /[1-9]/.test(frac) ? `.${frac.padEnd(2, "0").slice(0, 2)}` : "";
  return `${negative ? "-" : ""}${symbol}${digits}${cents}`;
}

export const PRICE_PERIOD_LABEL: Record<string, string> = {
  monthly: "/ month",
  yearly: "/ year",
  one_time: "",
  none: "",
};

export function formatDate(v: string | null | undefined): string {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export function humanize(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  return String(v)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
