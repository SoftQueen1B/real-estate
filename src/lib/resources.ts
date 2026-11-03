/**
 * Admin resource definitions. Field `name`s are the canonical API field names
 * from the PRD form-to-database contract — do not rename them.
 */
export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "decimal"
  | "textarea"
  | "date"
  | "time"
  | "datetime"
  | "select"
  | "relation"
  | "multirelation"
  | "checkbox"
  | "file"
  | "password";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  /** For relation fields: admin resource to load options from. */
  relation?: string;
  relationLabel?: (row: any) => string;
  span?: 2;
  help?: string;
}

export interface ColumnDef {
  key: string;
  label: string;
  format?: "money" | "date" | "status" | "bool";
  currencyKey?: string;
  render?: (row: any) => string;
}

export interface ResourceDef {
  key: string;
  title: string;
  singular: string;
  area: string;
  endpoint: string;
  fields: FieldDef[];
  columns: ColumnDef[];
  statusFilter?: string[];
  /** Quick status actions offered per row (API-backed transitions). */
  statusActions?: string[];
  readOnlyCreate?: boolean;
}

const CURRENCIES = ["NGN", "USD", "GBP"];
const fullName = (r: any) => [r.first_name, r.last_name].filter(Boolean).join(" ") || r.name || `#${r.id}`;
const titleOf = (r: any) => r.title ?? r.name ?? `#${r.id}`;
const listingLabel = (r: any) =>
  `${r.property?.title ?? `Property #${r.property_id}`} · ${r.listing_purpose ?? ""}`;

export const relationLabels: Record<string, (r: any) => string> = {
  owners: fullName,
  agents: fullName,
  clients: fullName,
  users: (r) => r.name ?? r.email,
  properties: titleOf,
  listings: listingLabel,
  tenancies: (r) => `Tenancy #${r.id}${r.tenant ? ` · ${fullName(r.tenant)}` : ""}`,
  transactions: (r) => r.reference ?? `Transaction #${r.id}`,
  amenities: (r) => r.name,
};

export const PROPERTY_TYPES = ["apartment", "duplex", "bungalow", "terrace", "detached_house", "semi_detached", "land", "commercial", "office", "shop", "warehouse"];

export const propertyFields: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", help: "Leave blank to let the server generate it." },
  { name: "property_type", label: "Property type", type: "select", options: PROPERTY_TYPES, required: true },
  { name: "owner_id", label: "Owner", type: "relation", relation: "owners", required: true },
  { name: "description", label: "Description", type: "textarea", span: 2 },
  { name: "address_line", label: "Address", type: "text", required: true, span: 2 },
  { name: "city", label: "City", type: "text", required: true },
  { name: "state", label: "State", type: "text", required: true },
  { name: "country", label: "Country", type: "text" },
  { name: "postal_code", label: "Postal code", type: "text" },
  { name: "bedrooms", label: "Bedrooms", type: "number" },
  { name: "bathrooms", label: "Bathrooms", type: "number" },
  { name: "toilets", label: "Toilets", type: "number" },
  { name: "parking_spaces", label: "Parking spaces", type: "number" },
  { name: "land_size", label: "Land size", type: "decimal" },
  { name: "floor_area", label: "Floor area", type: "decimal" },
  { name: "size_unit", label: "Size unit", type: "select", options: ["sqm", "sqft", "plot", "acre", "hectare"] },
  { name: "status", label: "Property status", type: "select", options: ["draft", "published", "unpublished", "archived"], required: true },
  { name: "amenity_ids", label: "Amenities", type: "multirelation", relation: "amenities", span: 2 },
];

export const listingFields: FieldDef[] = [
  { name: "property_id", label: "Property", type: "relation", relation: "properties", required: true },
  { name: "listing_purpose", label: "Listing purpose", type: "select", options: ["sale", "rent", "lease"], required: true },
  { name: "price", label: "Asking price", type: "decimal", required: true },
  { name: "currency", label: "Currency", type: "select", options: CURRENCIES, required: true },
  { name: "price_period", label: "Price period", type: "select", options: ["one_time", "monthly", "yearly", "none"], required: true },
  { name: "available_from", label: "Availability date", type: "date" },
  { name: "agent_id", label: "Assigned agent", type: "relation", relation: "agents" },
  { name: "status", label: "Listing status", type: "select", options: ["draft", "active", "under_offer", "sold", "rented", "withdrawn"], required: true },
  { name: "is_featured", label: "Featured", type: "checkbox" },
];

export const resources: Record<string, ResourceDef> = {
  properties: {
    key: "properties", title: "Properties", singular: "Property", area: "properties", endpoint: "properties",
    fields: propertyFields,
    columns: [
      { key: "title", label: "Title" },
      { key: "property_type", label: "Type", render: (r) => r.property_type },
      { key: "city", label: "City" },
      { key: "owner", label: "Owner", render: (r) => (r.owner ? fullName(r.owner) : "—") },
      { key: "status", label: "Status", format: "status" },
    ],
    statusFilter: ["draft", "published", "unpublished", "archived"],
  },
  listings: {
    key: "listings", title: "Listings", singular: "Listing", area: "listings", endpoint: "listings",
    fields: listingFields,
    columns: [
      { key: "property", label: "Property", render: (r) => r.property?.title ?? `#${r.property_id}` },
      { key: "listing_purpose", label: "Purpose", format: "status" },
      { key: "price", label: "Price", format: "money", currencyKey: "currency" },
      { key: "agent", label: "Agent", render: (r) => (r.agent ? fullName(r.agent) : "—") },
      { key: "is_featured", label: "Featured", format: "bool" },
      { key: "status", label: "Status", format: "status" },
    ],
    statusFilter: ["draft", "active", "under_offer", "sold", "rented", "withdrawn"],
  },
  owners: {
    key: "owners", title: "Owners", singular: "Owner", area: "owners", endpoint: "owners",
    fields: [
      { name: "first_name", label: "First name", type: "text", required: true },
      { name: "last_name", label: "Last name", type: "text", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "alternate_phone", label: "Alternate phone", type: "tel" },
      { name: "address_line", label: "Address", type: "text", span: 2 },
      { name: "city", label: "City", type: "text" },
      { name: "state", label: "State", type: "text" },
      { name: "notes", label: "Notes", type: "textarea", span: 2 },
    ],
    columns: [
      { key: "name", label: "Name", render: fullName },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "city", label: "City" },
      { key: "properties_count", label: "Properties" },
    ],
  },
  clients: {
    key: "clients", title: "Clients & leads", singular: "Client", area: "clients", endpoint: "clients",
    fields: [
      { name: "first_name", label: "First name", type: "text", required: true },
      { name: "last_name", label: "Last name", type: "text", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "client_type", label: "Client type", type: "select", options: ["buyer", "tenant", "investor", "other"], required: true },
      { name: "interested_purpose", label: "Interested purpose", type: "select", options: ["sale", "rent", "lease"] },
      { name: "budget_min", label: "Minimum budget", type: "decimal" },
      { name: "budget_max", label: "Maximum budget", type: "decimal" },
      { name: "preferred_location", label: "Preferred location", type: "text" },
      { name: "agent_id", label: "Assigned agent", type: "relation", relation: "agents" },
      { name: "lead_source", label: "Lead source", type: "select", options: ["website", "referral", "walk_in", "social_media", "phone", "other"] },
      { name: "status", label: "Lead status", type: "select", options: ["new", "contacted", "qualified", "converted", "lost"], required: true },
      { name: "notes", label: "Notes", type: "textarea", span: 2 },
    ],
    columns: [
      { key: "name", label: "Name", render: fullName },
      { key: "phone", label: "Phone" },
      { key: "client_type", label: "Type", format: "status" },
      { key: "preferred_location", label: "Location" },
      { key: "agent", label: "Agent", render: (r) => (r.agent ? fullName(r.agent) : "—") },
      { key: "status", label: "Status", format: "status" },
    ],
    statusFilter: ["new", "contacted", "qualified", "converted", "lost"],
  },
  agents: {
    key: "agents", title: "Agents", singular: "Agent", area: "agents", endpoint: "agents",
    fields: [
      { name: "user_id", label: "User account", type: "relation", relation: "users", help: "Contact details below are stored on the agent record." },
      { name: "first_name", label: "First name", type: "text", required: true },
      { name: "last_name", label: "Last name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "tel" },
      { name: "specialization", label: "Specialization", type: "text" },
      { name: "status", label: "Status", type: "select", options: ["active", "inactive"], required: true },
      { name: "profile_image", label: "Profile image", type: "file" },
      { name: "bio", label: "Biography", type: "textarea", span: 2 },
    ],
    columns: [
      { key: "name", label: "Name", render: fullName },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "specialization", label: "Specialization" },
      { key: "status", label: "Status", format: "status" },
    ],
  },
  enquiries: {
    key: "enquiries", title: "Enquiries", singular: "Enquiry", area: "enquiries", endpoint: "enquiries",
    readOnlyCreate: true,
    fields: [
      { name: "status", label: "Status", type: "select", options: ["new", "in_progress", "responded", "closed"], required: true },
      { name: "agent_id", label: "Assigned agent", type: "relation", relation: "agents" },
      { name: "internal_notes", label: "Follow-up notes", type: "textarea", span: 2 },
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "subject", label: "Subject" },
      { key: "listing", label: "Listing", render: (r) => r.listing?.property?.title ?? "General" },
      { key: "created_at", label: "Received", format: "date" },
      { key: "status", label: "Status", format: "status" },
    ],
    statusFilter: ["new", "in_progress", "responded", "closed"],
  },
  inspections: {
    key: "inspections", title: "Inspections", singular: "Inspection", area: "inspections", endpoint: "inspections",
    readOnlyCreate: true,
    fields: [
      { name: "requested_date", label: "Date", type: "date", required: true },
      { name: "requested_time", label: "Time", type: "time", required: true },
      { name: "client_id", label: "Client", type: "relation", relation: "clients" },
      { name: "status", label: "Status", type: "select", options: ["pending", "confirmed", "rescheduled", "cancelled", "completed"], required: true },
      { name: "message", label: "Message", type: "textarea", span: 2 },
    ],
    columns: [
      { key: "name", label: "Visitor" },
      { key: "listing", label: "Listing", render: (r) => r.listing?.property?.title ?? `#${r.listing_id}` },
      { key: "requested_date", label: "Date", format: "date" },
      { key: "requested_time", label: "Time" },
      { key: "status", label: "Status", format: "status" },
    ],
    statusFilter: ["pending", "confirmed", "rescheduled", "cancelled", "completed"],
    statusActions: ["confirmed", "cancelled", "completed"],
  },
  transactions: {
    key: "transactions", title: "Transactions", singular: "Transaction", area: "transactions", endpoint: "transactions",
    fields: [
      { name: "listing_id", label: "Listing", type: "relation", relation: "listings", required: true },
      { name: "client_id", label: "Client", type: "relation", relation: "clients", required: true },
      { name: "agent_id", label: "Agent", type: "relation", relation: "agents" },
      { name: "transaction_type", label: "Transaction type", type: "select", options: ["sale", "rent", "lease"], required: true },
      { name: "amount", label: "Amount", type: "decimal", required: true },
      { name: "currency", label: "Currency", type: "select", options: CURRENCIES, required: true },
      { name: "transaction_date", label: "Transaction date", type: "date", required: true },
      { name: "reference", label: "Reference", type: "text" },
      { name: "status", label: "Status", type: "select", options: ["pending", "in_progress", "completed", "cancelled"], required: true },
      { name: "notes", label: "Notes", type: "textarea", span: 2 },
    ],
    columns: [
      { key: "reference", label: "Reference" },
      { key: "transaction_type", label: "Type", format: "status" },
      { key: "client", label: "Client", render: (r) => (r.client ? fullName(r.client) : "—") },
      { key: "amount", label: "Amount", format: "money", currencyKey: "currency" },
      { key: "transaction_date", label: "Date", format: "date" },
      { key: "status", label: "Status", format: "status" },
    ],
    statusFilter: ["pending", "in_progress", "completed", "cancelled"],
  },
  tenancies: {
    key: "tenancies", title: "Tenancies", singular: "Tenancy", area: "tenancies", endpoint: "tenancies",
    fields: [
      { name: "listing_id", label: "Listing", type: "relation", relation: "listings", required: true },
      { name: "tenant_id", label: "Tenant", type: "relation", relation: "clients", required: true },
      { name: "start_date", label: "Start date", type: "date", required: true },
      { name: "end_date", label: "End date", type: "date", required: true },
      { name: "rent_amount", label: "Rent amount", type: "decimal", required: true },
      { name: "currency", label: "Currency", type: "select", options: CURRENCIES, required: true },
      { name: "rent_frequency", label: "Rent frequency", type: "select", options: ["monthly", "quarterly", "yearly"], required: true },
      { name: "security_deposit", label: "Security deposit", type: "decimal" },
      { name: "status", label: "Status", type: "select", options: ["pending", "active", "ended", "terminated"], required: true },
      { name: "notes", label: "Notes", type: "textarea", span: 2 },
    ],
    columns: [
      { key: "listing", label: "Property", render: (r) => r.listing?.property?.title ?? `#${r.listing_id}` },
      { key: "tenant", label: "Tenant", render: (r) => (r.tenant ? fullName(r.tenant) : "—") },
      { key: "rent_amount", label: "Rent", format: "money", currencyKey: "currency" },
      { key: "start_date", label: "Start", format: "date" },
      { key: "end_date", label: "End", format: "date" },
      { key: "status", label: "Status", format: "status" },
    ],
    statusFilter: ["pending", "active", "ended", "terminated"],
  },
  payments: {
    key: "payments", title: "Payments", singular: "Payment", area: "payments", endpoint: "payments",
    fields: [
      { name: "tenancy_id", label: "Tenancy", type: "relation", relation: "tenancies" },
      { name: "transaction_id", label: "Transaction", type: "relation", relation: "transactions" },
      { name: "payer_name", label: "Payer name", type: "text", required: true },
      { name: "amount", label: "Amount", type: "decimal", required: true },
      { name: "currency", label: "Currency", type: "select", options: CURRENCIES, required: true },
      { name: "payment_date", label: "Payment date", type: "date", required: true },
      { name: "payment_method", label: "Payment method", type: "select", options: ["bank_transfer", "cash", "cheque", "pos", "other"], required: true },
      { name: "reference", label: "Reference", type: "text" },
      { name: "status", label: "Status", type: "select", options: ["pending_verification", "verified", "rejected"], required: true, help: "Manually recorded. Only authorised staff can mark a payment verified." },
      { name: "notes", label: "Notes", type: "textarea", span: 2 },
    ],
    columns: [
      { key: "payer_name", label: "Payer" },
      { key: "amount", label: "Amount", format: "money", currencyKey: "currency" },
      { key: "payment_method", label: "Method", format: "status" },
      { key: "payment_date", label: "Date", format: "date" },
      { key: "status", label: "Status", format: "status" },
    ],
    statusFilter: ["pending_verification", "verified", "rejected"],
  },
  expenses: {
    key: "expenses", title: "Expenses", singular: "Expense", area: "expenses", endpoint: "expenses",
    fields: [
      { name: "category", label: "Category", type: "select", options: ["maintenance", "utilities", "marketing", "legal", "salaries", "taxes", "other"], required: true },
      { name: "amount", label: "Amount", type: "decimal", required: true },
      { name: "currency", label: "Currency", type: "select", options: CURRENCIES, required: true },
      { name: "expense_date", label: "Expense date", type: "date", required: true },
      { name: "property_id", label: "Property", type: "relation", relation: "properties" },
      { name: "reference", label: "Reference", type: "text" },
      { name: "status", label: "Status", type: "select", options: ["pending", "approved", "paid", "rejected"], required: true },
      { name: "description", label: "Description", type: "textarea", required: true, span: 2 },
      { name: "notes", label: "Notes", type: "textarea", span: 2 },
    ],
    columns: [
      { key: "category", label: "Category", format: "status" },
      { key: "description", label: "Description" },
      { key: "amount", label: "Amount", format: "money", currencyKey: "currency" },
      { key: "expense_date", label: "Date", format: "date" },
      { key: "status", label: "Status", format: "status" },
    ],
    statusFilter: ["pending", "approved", "paid", "rejected"],
  },
  maintenance: {
    key: "maintenance", title: "Maintenance", singular: "Maintenance request", area: "maintenance", endpoint: "maintenance-requests",
    fields: [
      { name: "property_id", label: "Property", type: "relation", relation: "properties", required: true },
      { name: "tenancy_id", label: "Tenancy", type: "relation", relation: "tenancies" },
      { name: "title", label: "Title", type: "text", required: true, span: 2 },
      { name: "priority", label: "Priority", type: "select", options: ["low", "medium", "high", "urgent"], required: true },
      { name: "status", label: "Status", type: "select", options: ["open", "scheduled", "in_progress", "resolved", "closed"], required: true },
      { name: "assigned_to", label: "Assigned staff", type: "relation", relation: "users" },
      { name: "scheduled_at", label: "Scheduled date", type: "datetime" },
      { name: "cost", label: "Cost", type: "decimal" },
      { name: "description", label: "Description", type: "textarea", required: true, span: 2 },
    ],
    columns: [
      { key: "title", label: "Title" },
      { key: "property", label: "Property", render: (r) => r.property?.title ?? `#${r.property_id}` },
      { key: "priority", label: "Priority", format: "status" },
      { key: "scheduled_at", label: "Scheduled", format: "date" },
      { key: "status", label: "Status", format: "status" },
    ],
    statusFilter: ["open", "scheduled", "in_progress", "resolved", "closed"],
  },
  users: {
    key: "users", title: "Users", singular: "User", area: "users", endpoint: "users",
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "role", label: "Role", type: "select", options: ["super_admin", "admin", "property_manager", "agent", "finance_officer"], required: true, help: "The server rejects role changes you aren't allowed to make." },
      { name: "status", label: "Status", type: "select", options: ["active", "suspended"], required: true },
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role", format: "status" },
      { key: "status", label: "Status", format: "status" },
    ],
  },
  pages: {
    key: "pages", title: "Pages", singular: "Page", area: "content", endpoint: "pages",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "meta_title", label: "Meta title", type: "text" },
      { name: "status", label: "Status", type: "select", options: ["draft", "published"], required: true },
      { name: "meta_description", label: "Meta description", type: "textarea", span: 2 },
      { name: "content", label: "Content", type: "textarea", required: true, span: 2 },
    ],
    columns: [
      { key: "title", label: "Title" },
      { key: "slug", label: "Slug" },
      { key: "updated_at", label: "Updated", format: "date" },
      { key: "status", label: "Status", format: "status" },
    ],
  },
  blog: {
    key: "blog", title: "Blog posts", singular: "Blog post", area: "content", endpoint: "blog-posts",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "status", label: "Status", type: "select", options: ["draft", "published"], required: true },
      { name: "published_at", label: "Published date", type: "datetime" },
      { name: "featured_image", label: "Featured image", type: "file" },
      { name: "excerpt", label: "Excerpt", type: "textarea", span: 2 },
      { name: "content", label: "Content", type: "textarea", required: true, span: 2 },
    ],
    columns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "published_at", label: "Published", format: "date" },
      { key: "status", label: "Status", format: "status" },
    ],
  },
  faqs: {
    key: "faqs", title: "FAQs", singular: "FAQ", area: "content", endpoint: "faqs",
    fields: [
      { name: "question", label: "Question", type: "text", required: true, span: 2 },
      { name: "answer", label: "Answer", type: "textarea", required: true, span: 2 },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["draft", "published"], required: true },
    ],
    columns: [
      { key: "question", label: "Question" },
      { key: "sort_order", label: "Order" },
      { key: "status", label: "Status", format: "status" },
    ],
  },
};

/** Build a request body containing only defined canonical fields. */
export function buildPayload(fields: FieldDef[], values: Record<string, any>): Record<string, any> | FormData {
  const hasFile = fields.some((f) => f.type === "file" && values[f.name] instanceof File);
  const out: Record<string, any> = {};
  for (const f of fields) {
    let v = values[f.name];
    if (f.type === "file") {
      if (v instanceof File) out[f.name] = v;
      continue;
    }
    if (v === "" || v === undefined) v = null;
    if (f.type === "number" || f.type === "relation") v = v === null ? null : Number(v);
    if (f.type === "multirelation") v = Array.isArray(v) ? v.map(Number) : [];
    if (f.type === "checkbox") v = Boolean(v);
    // decimals stay strings to avoid floating-point loss
    out[f.name] = v;
  }
  if (!hasFile) return out;
  const fd = new FormData();
  Object.entries(out).forEach(([k, v]) => {
    if (v === null) return;
    if (Array.isArray(v)) v.forEach((x) => fd.append(`${k}[]`, String(x)));
    else if (v instanceof File) fd.append(k, v);
    else fd.append(k, typeof v === "boolean" ? (v ? "1" : "0") : String(v));
  });
  return fd;
}
